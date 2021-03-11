import { Inject, Injectable } from '@nestjs/common';
import { filter, map } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { KeyType, Redis } from 'ioredis';

/**
 * Import local objects
 */
import { RedisSubscribeMessageInterface } from './interface';
import {
  REDIS_EXPIRE_KEY_NAME,
  REDIS_EXPIRE_TIME_IN_SECONDS,
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';

/**
 * Redis Service Class
 */
@Injectable()
export class RedisService {
  /**
   * Constructor of Redis Service Class
   * @param {Redis} subscriber Redis subscriber
   * @param {Redis} publisher Redis publisher
   */
  public constructor(
    @Inject(REDIS_SUBSCRIBER_CLIENT) private readonly subscriber: Redis,
    @Inject(REDIS_PUBLISHER_CLIENT) private readonly publisher: Redis,
  ) {}

  /**
   * Get observable from event
   * @param {string} eventName
   */
  public fromEvent<T>(eventName: string): Observable<T> {
    this.subscriber.subscribe(eventName);

    return Observable.create(
      (observer: Observer<RedisSubscribeMessageInterface>) =>
        this.subscriber.on('message', (channel, message) =>
          observer.next({ channel, message }),
        ),
    ).pipe(
      filter(({ channel }) => channel === eventName),
      map(({ message }) => JSON.parse(message)),
    );
  }

  /**
   * Publish
   * @param {string} channel
   * @param {unknown} value
   */
  public async publish(channel: string, value: unknown): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.publisher.publish(
        channel,
        JSON.stringify(value),
        (error: any, reply: any) => {
          if (error) return reject(error);

          return resolve(reply);
        },
      );
    });
  }

  /**
   * Set key
   * @param {KeyType} key
   * @param {unknown} value
   */
  public async set(key: KeyType, value: unknown) {
    await this.publisher.set(
      key,
      JSON.stringify(value),
      REDIS_EXPIRE_KEY_NAME,
      REDIS_EXPIRE_TIME_IN_SECONDS,
    );
  }

  /**
   * Get key
   * @param {KeyType} key
   */
  public async get(key: KeyType) {
    const res = await this.publisher.get(key);
    return await JSON.parse(res);
  }

  /**
   * Delete key
   * @param {KeyType} key
   */
  public async del(key: KeyType) {
    return await this.publisher.del(key);
  }
}
