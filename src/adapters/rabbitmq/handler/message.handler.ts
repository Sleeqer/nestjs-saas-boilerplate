/**
 * Import local objects
 */
import { RabbitMQEnum, RabbitMQExchangeTypeEnum } from '../interface';

/**
 * Queue
 */
export const _QUEUE: string = `messages_queue`;

/**
 * Messages handler
 * @param {any} message
 */
const handler = async (message: any): Promise<RabbitMQEnum> => {
  console.log(message, 'handler');

  return RabbitMQEnum.ACK;
};

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
