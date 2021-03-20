import { Logger } from 'winston';

/**
 * Import local objects
 */
import { RedisPropagatorService } from '../../redis/propagator/redis.propagator.service';
import {
  RabbitMQEnum,
  RabbitMQOptionInterface,
} from '../interface/rabbitmq.option.interface';

/**
 * Message Handler Class
 */
export class MessageHandler {
  /**
   * @type {RabbitMQOptionInterface}
   */
  public options: RabbitMQOptionInterface;

  /**
   * @type {Function}
   */
  public handler: (
    message: unknown,
    propagator?: RedisPropagatorService,
    logger?: Logger,
  ) => Promise<RabbitMQEnum>;

  /**
   * Log headline
   * @type {string}
   */
  protected readonly log: string = `[Handler]`;

  /**
   * Constructor of Message Handler Class
   * @param {Function} handler Handler of incomming messages
   * @param {RabbitMQOptionInterface} options Options
   */
  constructor(
    handler: (
      message: unknown,
      propagator?: RedisPropagatorService,
      logger?: Logger,
    ) => Promise<RabbitMQEnum>,
    options: RabbitMQOptionInterface,
  ) {
    this.handler = handler;
    this.options = options;
  }
}
