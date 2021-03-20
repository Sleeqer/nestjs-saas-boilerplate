import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';
import { Logger } from 'winston';
import {
  INestApplicationContext,
  WebSocketAdapter,
  Inject,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { RedisPropagatorService } from '../../redis/propagator/redis.propagator.service';
import { SocketStateService } from './socket.state.service';

/**
 * Redis Propagator Service Class
 */
interface TokenPayload {
  readonly profile: string;
}

/**
 * Redis Propagator Service Class
 */
export interface AuthenticatedSocket extends socketio.Socket {
  auth: TokenPayload;
}

/**
 * Redis Propagator Service Class
 */
export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  /**
   * Log headline
   * @type {string}
   */
  private readonly log: string = `[Socket-Adapter]`;

  /**
   * Constructor of Socket State Adapter Class
   * @param {INestApplicationContext} application Application
   * @param {SocketStateService} socket Socket State Service
   * @param {RedisService} redis Redis Service Service
   * @param {Logger} logger Logger Service
   */
  public constructor(
    application: INestApplicationContext,
    private readonly socket: SocketStateService,
    private readonly redis: RedisPropagatorService,
    @Inject('winston') private readonly logger?: Logger,
  ) {
    super(application);
  }

  /**
   * Create adapter
   * @param {number} port
   * @param {socketio.ServerOptions} options
   */
  public create(
    port: number,
    options: socketio.ServerOptions,
  ): socketio.Server {
    const server = super.createIOServer(port, options);
    this.redis.injectSocketServer(server);

    server.use(async (socket: AuthenticatedSocket, next) => {
      const token =
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization;

      if (!token) {
        socket.auth = null;

        /**
         * Non authenticated connection is still valid
         */
        return next();
      }

      try {
        // fake auth
        socket.auth = {
          profile: '1234',
        };

        return next();
      } catch (error) {
        this.logger.error(`${this.log} -> Error on create (${error.message})`);
        return next(error);
      }
    });

    return server;
  }

  /**
   * Bind connection
   * @param {socketio.Server} server
   * @param {Function} callback
   */
  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        callback(socket);

        this.socket.add(socket.auth.profile, socket);

        socket.on('disconnect', () => {
          this.socket.destroy(socket.auth.profile, socket);
          socket.removeAllListeners('disconnect');
        });
      }

      callback(socket);
    });
  }
}
