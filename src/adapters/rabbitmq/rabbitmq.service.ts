import { Injectable, Inject } from '@nestjs/common';
import { Channel } from 'amqplib';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { RedisPropagatorService } from '../redis/propagator/redis.propagator.service';
import { ConfigService } from '../../modules/config';
import { connection } from './rabbitmq.connect';
import subscriptions from './handler';
import {
  RabbitMQOptionInterface,
  RabbitMQResponseType,
  RabbitMQEnum,
} from './interface';

/**
 * Current config
 * @type {ConfigService}
 */
const config: ConfigService = ConfigService.getInstance();

/**
 * RabbitMQ Service Class
 */
@Injectable()
export class RabbitMQService {
  /**
   * Log headline
   * @type {string}
   */
  private readonly log: string = `[RabbitMQService]`;

  /**
   * Channel
   * @type {Channel}
   */
  public channel: Channel;

  /**
   * Constructor of RabbitMQ Service Class
   * @param {RedisPropagatorService} propagator Redis Propagator Service
   * @param {Logger} logger Logger Service
   */
  constructor(
    private readonly propagator: RedisPropagatorService,
    @Inject('winston') private readonly logger: Logger,
  ) {
    /**
     * Create channel connection
     */
    this.create();
  }

  /**
   * Create channel connection
   */
  private create() {
    this.logger.info(`${this.log} -> Create channel connection`);

    connection()
      .then((channel) => {
        this.channel = channel;

        /**
         * Channel error
         */
        this.channel.on('error', (error) => {
          this.logger.error(
            `${this.log} -> Error on channel (${error.message})`,
          );

          setTimeout(() => {
            this.create();
          }, (config.get('RABBITMQ_RECONNECT_TIMEOUT') as unknown) as number);
        });

        /**
         * Channel close
         */
        this.channel.on('close', (error) => {
          this.logger.warn(`${this.log} -> Channel close (${error})`);

          setTimeout(() => {
            this.create();
          }, (config.get('RABBITMQ_RECONNECT_TIMEOUT') as unknown) as number);
        });

        /**
         * Channel assert
         */
        this.channel
          .assertExchange(
            config.get('RABBITMQ_EXCHANGE'),
            config.get('RABBITMQ_EXCHANGE_TYPE'),
            {
              durable: true,
            },
          )
          .then((response) => {
            this.logger.info(
              `${this.log} -> Assert exchange "${response.exchange}"`,
            );

            /**
             * Subscribe to handlers
             */
            subscriptions.forEach(async (subscription) => {
              return await this.subscribe(
                subscription.options,
                subscription.handler,
              );
            });
          });

        /**
         * Channel prefetching
         */
        this.channel.prefetch(
          (config.get('RABBITMQ_PREFETCH') as unknown) as number,
        );
      })
      .catch((error) => {
        this.logger.error(
          `${this.log} -> Error on create channel connection (${error.message})`,
        );
      });
  }

  /**
   * Subscribe to message
   * @param {RabbitMQOptionInterface} options Subscription options
   * @param {Promise<RabbitMQResponseType>} handler Subscription handler
   */
  private async subscribe(
    options: RabbitMQOptionInterface,
    handler: (
      message: unknown,
      propagator?: RedisPropagatorService,
      logger?: Logger,
    ) => Promise<RabbitMQResponseType>,
  ) {
    try {
      const { queue } = await this.channel.assertQueue(options.queue || '');

      /**
       * Binding
       */
      await this.channel
        .assertExchange(options.exchange.title, options.exchange.type, {
          durable: true,
        })
        .then((response) => {
          this.logger.info(
            `${this.log} -> Assert exchange "${response.exchange}"`,
          );
        });
      await this.channel.bindQueue(queue, options.exchange.title, options.key);
      this.logger.info(`${this.log} -> Bind queue "${options.queue}"`);

      /**
       * Channel consumer
       */
      await this.channel.consume(queue, async (message) => {
        if (message === null) return;

        const content = message.content.toString();
        const messager = JSON.parse(JSON.stringify(content));
        this.logger.info(`${this.log} -> Consume "${options.key}"`);
        const response = await handler(messager, this.propagator, this.logger);

        /**
         * NAcknowledge message
         */
        if (response === RabbitMQEnum.NACK)
          return this.channel.nack(message, false, false);

        /**
         * Acknowledge message
         */
        return this.channel.ack(message, false);
      });
    } catch (error) {
      this.logger.error(`${this.log} -> Error on subscribe (${error.message})`);
    }
  }

  /**
   * Send message to channel
   * @param {T} message Message
   * @param {string} key Key
   * @param {string} exchange Exchange
   */
  public async send<T>(message: T, key: string, exchange: string = '') {
    try {
      if (!this.channel) return;

      /**
       * Publish message
       */
      this.channel.publish(
        exchange || config.get('RABBITMQ_EXCHANGE'),
        key,
        Buffer.from(JSON.stringify(message)),
      );
    } catch (error) {
      this.logger.error(`${this.log} -> Error on send (${error.message})`);
    }
  }
}
