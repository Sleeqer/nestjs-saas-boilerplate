/**
 * Import local objects
 */
import {
  RabbitMQEnum,
  RabbitMQExchangeTypeEnum,
} from '../../../adapters/rabbitmq/interface';

/**
 * Queue
 */
export const _QUEUE: string = `messages_queue`;

/**
 * Messages handler
 * @param {any} message
 */
const handler = async (message: any): Promise<RabbitMQEnum> => {
  console.log(message, 'handlerx');

  return RabbitMQEnum.ACK;
};

/**
 * Format Response Exception Class
 */
export class FormatResponseException {
  protected options: object = {
    exchange: {
      title: 'exchangg',
      type: RabbitMQExchangeTypeEnum.DIRECT,
    },
    key: 'x',
    queue: 'extends',
  };

  protected handler: Function;

  /**
   * Constructor of Format Response Exception Class
   * @param {string} message Message
   * @param {string} property Property of message
   * @param {object} details Details
   */
  constructor(handler: Function) {
    this.handler = Function;
  }
}

/**
 * Export handler
 */
export default [
  {
    options: {
      exchange: {
        title: 'exchangg',
        type: RabbitMQExchangeTypeEnum.DIRECT,
      },
      key: 'x',
      queue: 'extends',
    },
    handler,
  },
];
