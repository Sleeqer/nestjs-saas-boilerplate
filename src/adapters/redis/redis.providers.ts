import { Provider } from '@nestjs/common';
import * as IORedis from 'ioredis';

/**
 * Import local objects
 */
import { ConfigService } from '../../modules/config/config.service';
import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';

/**
 * Current config
 * @type {ConfigService}
 */
const config: ConfigService = new ConfigService();

/**
 * Current config
 * @type {ConfigService}
 */
export const RedisProviders: Provider[] = [
  {
    useFactory: (): IORedis.Redis => {
      return new IORedis({
        host: config.get('REDIS_HOST'),
        port: (config.get('REDIS_PORT') as unknown) as number,
        password: config.get('REDIS_PASSWORD'),
      });
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (): IORedis.Redis => {
      return new IORedis({
        host: config.get('REDIS_HOST'),
        port: (config.get('REDIS_PORT') as unknown) as number,
        password: config.get('REDIS_PASSWORD'),
      });
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
