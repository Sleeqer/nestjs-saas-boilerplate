import { Logger } from 'winston';

/**
 * Import local objects
 */
import { MessageHandler } from '../../../adapters/rabbitmq/handler/message.handler';
import { RabbitMQExchangeTypeEnum } from '../../../adapters/rabbitmq/interface';
import { RedisPropagatorService } from '../../../adapters/redis';
import { EXCHANGE, KEY, QUEUE } from './entity.handler.enum';
import { ConfigService } from '../../config';
import {
  RabbitMQOptionInterface,
  RabbitMQEnum,
} from '../../../adapters/rabbitmq';

/**
 * Current config
 * @type {ConfigService}
 */
const config: ConfigService = ConfigService.getInstance();

/**
 * Queue
 * @type {string}
 */
export const _QUEUE: string = `${config.get('APPLICATION_NAME')}_entities`;

/**
 * Messages handler
 * @param {unknown} message Message
 * @param {RedisPropagatorService} propagator Socket propagator
 * @param {Logger} logger Logger
 * @returns {Promise<RabbitMQEnum>} Ack event
 */
const handler = async (
  message: unknown | any,
  propagator?: RedisPropagatorService,
  logger?: Logger,
): Promise<RabbitMQEnum> => {
  try {
    const parsed = JSON.parse(message);

    if (propagator)
      propagator.EMIT_ALL({
        event: parsed?.title || '',
        data: parsed?.entity || {},
      });

    return RabbitMQEnum.ACK;
  } catch (error) {
    if (logger)
      logger.error(`[EntityHandler] -> Error on handler (${error.message})`);

    return RabbitMQEnum.NACK;
  }
};

/**
 * Entity Handler Class
 */
export class EntityHandler extends MessageHandler {
  /**
   * Constructor of Entity Handler Class
   * @param {Function} handler Handler of incomming message
   * @param {RabbitMQOptionInterface} options Options of handler
   */
  constructor(
    handler: (
      message: unknown,
      propagator?: RedisPropagatorService,
      logger?: Logger,
    ) => Promise<RabbitMQEnum>,
    options: RabbitMQOptionInterface,
  ) {
    super(handler, options);
  }
}

/**
 * Export handler
 */
export default [
  new EntityHandler(handler, {
    exchange: {
      title: EXCHANGE.CREATED,
      type: RabbitMQExchangeTypeEnum.DIRECT,
    },
    key: KEY.CREATED,
    queue: QUEUE.CREATED,
  }),
];
