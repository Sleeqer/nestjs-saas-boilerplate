import { Injectable, Inject } from '@nestjs/common';
import { Channel } from 'amqplib';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import {
  RabbitMQOptionInterface,
  RabbitMQResponseType,
  RabbitMQEnum,
} from './interface';
import { ConfigService } from '../../modules/config/config.service';
import { connection } from './rabbitmq.connect';
import subscriptions from './handler';

/**
 * Current config
 * @type {ConfigService}
 */
const config: ConfigService = new ConfigService('.env');

/**
 * RabbitMQ Service Class
 */
@Injectable()
export class RabbitMQService {
  /**
   * Channel
   * @type {Channel}
   */
  public channel: Channel;

  /**
   * Constructor of RabbitMQ Service Class
   * @param {Logger} logger Logger Service
   */
  constructor(@Inject('winston') private readonly logger: Logger) {
    this.create();
  }

  /**
   * Create channel connection
   */
  private create() {
    connection().then((channel) => {
      this.logger.info(`[RabbitMQService] -> Channel create`);
      this.channel = channel;

      /**
       * Channel error
       */
      this.channel.on('error', (error) => {
        this.logger.error(`[RabbitMQService] -> Error \n ${error.message}`);

        setTimeout(() => {
          this.create();
        }, (config.get('RABBITMQ_RECONNECT_TIMEOUT') as unknown) as number);
      });

      /**
       * Channel close
       */
      this.channel.on('close', (error) => {
        this.logger.warn(`[RabbitMQService] -> Close \n ${error.message}`);

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
          this.logger.warn(
            `[RabbitMQService] -> Assert exchange "${response.exchange}"`,
          );

          /**
           * Subscribe to handlers
           */
          subscriptions.forEach(
            async (subscription) =>
              await this.subscribe(subscription.options, subscription.handler),
          );
        });

      /**
       * Channel prefetching
       */
      this.channel.prefetch(
        (config.get('RABBITMQ_PREFETCH') as unknown) as number,
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
    handler: (message: unknown) => Promise<RabbitMQResponseType>,
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
          this.logger.warn(
            `[RabbitMQService] -> Assert exchange "${response.exchange}"`,
          );
        });
      await this.channel.bindQueue(queue, options.exchange.title, options.key);
      this.logger.warn(`[RabbitMQService] -> Bind queue "${options.queue}"`);

      /**
       * Channel consumer
       */
      await this.channel.consume(queue, async (message) => {
        if (message === null) return;

        const content = message.content.toString();
        const messager = JSON.parse(JSON.stringify(content));
        this.logger.warn(`[RabbitMQService] -> Consume "${options.key}"`);
        const response = await handler(messager);

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
      this.logger.error(`[RabbitMQService] -> Error \n ${error.message}`);
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
      this.logger.error(`[RabbitMQService] -> Error \n ${error.message}`);
    }
  }
}
