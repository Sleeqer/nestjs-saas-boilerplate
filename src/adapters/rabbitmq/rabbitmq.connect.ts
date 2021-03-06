import { Channel, connect } from 'amqplib';

/**
 * Import local objects
 */
import { ConfigService } from '../../modules/config/config.service';

/**
 * Current config
 * @type {ConfigService}
 */
const config: ConfigService = new ConfigService();

/**
 * Connection URL
 */
const url = `amqp://${config.get('RABBITMQ_USERNAME')}:${config.get(
  'RABBITMQ_PASSWORD',
)}@${config.get('RABBITMQ_HOST')}:${config.get('RABBITMQ_PORT')}/${config.get(
  'RABBITMQ_VHOST',
)}`;

/**
 * Rejections , reject only once
 */
var rejection = false;

/**
 * Current connection
 * @returns {Promise<Channel>}
 */
export const connection = (): Promise<Channel> => {
  return new Promise(async (resolve, _reject) => {
    try {
      const connection = await connect(url);

      const channel = await connection.createChannel();

      resolve(channel);
    } catch (error) {
      /**
       * Notify connector about error
       */
      if (!rejection) {
        rejection = true;
        _reject(error);
      }

      /**
       * Reconnection
       */
      setTimeout(() => {
        resolve(connection());
      }, (config.get('RABBITMQ_RECONNECT_TIMEOUT') as unknown) as number);
    }
  });
};
