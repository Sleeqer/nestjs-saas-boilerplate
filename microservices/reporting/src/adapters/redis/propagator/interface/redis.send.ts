/**
 * Import local objects
 */
import { RedisEmit } from './redis.emit';

/**
 * Redis Emit Class
 */
export class RedisSend extends RedisEmit {
  /**
   * Profile field
   */
  public readonly profile: string;

  /**
   * Socket field
   */
  public readonly socket: string;
}
