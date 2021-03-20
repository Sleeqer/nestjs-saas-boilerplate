import { Logger } from 'winston';

/**
 * Import local objects
 */
import { MessageHandler } from '../../../adapters/rabbitmq/handler/message.handler';
import { RabbitMQExchangeTypeEnum } from '../../../adapters/rabbitmq/interface';
import { EXCHANGE, KEY, QUEUE } from './member.handler.enum';
import { RedisPropagatorService } from '../../../adapters/redis';
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
 */
export const _QUEUE: string = `${config.get('APPLICATION_NAME')}_members`;

/**
 * Messages handler
 * @param {unknown} message
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
      logger.error(
        `[MemberHandler] -> Error on handler (${error.message})`,
      );

    return RabbitMQEnum.NACK;
  }
};

/**
 * Format Response Exception Class
 */
export class MemberHandler extends MessageHandler {
  /**
   * Constructor of Format Response Exception Class
   * @param {Function} handler Handler of incomming message
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
  new MemberHandler(handler, {
    exchange: {
      title: EXCHANGE.CREATED,
      type: RabbitMQExchangeTypeEnum.DIRECT,
    },
    key: KEY.CREATED,
    queue: QUEUE.CREATED,
  }),
];
