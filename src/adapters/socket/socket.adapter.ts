import { createAdapter, RedisAdapterOptions } from 'socket.io-redis';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { Server, ServerOptions } from 'socket.io';
import { Redis } from 'ioredis';

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
 * Redis Adapter Class
 */
export class RedisAdapter extends IoAdapter {
  /**
   * Constructor of Redis Adapter Class
   * @param {INestApplication} application Application
   * @param {Redis} subscriber Redis subscriber client
   * @param {Redis} publisher Redis publisher client
   */
  constructor(
    application: INestApplication,
    private readonly subscriber: Redis,
    private readonly publisher: Redis,
  ) {
    super(application);
  }

  /**
   * Create IO Server
   * @param {number} port IO Server Port
   * @param {ServerOptions} options IO Server Options
   * @returns {Server} IO Server
   */
  public createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options);

    server.adapter(
      createAdapter({
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        auth_pass: config.get('REDIS_PASSWORD'),
        key: config.get('REDIS_KEY'),
        pubClient: this.publisher,
        subClient: this.subscriber,
      } as Partial<RedisAdapterOptions>),
    );

    return server;
  }
}
