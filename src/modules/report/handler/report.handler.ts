import { Logger } from 'winston';

/**
 * Import local objects
 */
import { Report } from '../report.entity';
import {
  RabbitMQEnum,
  RabbitMQExchangeTypeEnum,
} from '../../../adapters/rabbitmq/interface';
import { EXCHANGE, KEY, QUEUE } from './report.handler.enum';
import { ConfigService } from '../../config/config.service';
import { RedisPropagatorService } from 'src/adapters/redis/propagator/redis.propgator.service';
import { RabbitMQOptionInterface } from '../../../adapters/rabbitmq/interface/rabbitmq.option.interface';
import { MessageHandler } from 'src/adapters/rabbitmq/handler/message.handler';

/**
 * Current config
 * @type {ConfigService}
 */
const config: ConfigService = ConfigService.getInstance();

/**
 * Queue
 */
export const _QUEUE: string = `${config.get('APPLICATION_NAME')}-entities`;

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
      logger.error(`[ReportHandler] -> Error on handler (${error.message})`);

    return RabbitMQEnum.NACK;
  }
};

/**
 * Format Response Exception Class
 */
export class ReportHandler extends MessageHandler {
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
  new ReportHandler(handler, {
    exchange: {
      title: EXCHANGE.CREATED,
      type: RabbitMQExchangeTypeEnum.DIRECT,
    },
    key: KEY.CREATED,
    queue: QUEUE.CREATED,
  }),
];
