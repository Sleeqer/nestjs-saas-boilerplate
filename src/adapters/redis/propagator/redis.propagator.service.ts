import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';

/**
 * Import local objects
 */
import { SocketStateService } from '../../socket/state/socket.state.service';
import { RedisEmit, RedisSend } from './interface';
import { RedisService } from '../redis.service';
import {
  REDIS_SOCKET_AUTH,
  REDIS_SOCKET_EMIT,
  REDIS_SOCKET_SEND,
} from './redis.propagator.constants';

/**
 * Redis Propagator Service Class
 */
@Injectable()
export class RedisPropagatorService {
  /**
   * Socket Server
   */
  private server: Server;

  /**
   * Constructor of Redis Propagator Service Class
   * @param {SocketStateService} socket Socket State Service
   * @param {RedisService} redis Redis Service Service
   */
  public constructor(
    private readonly socket: SocketStateService,
    private readonly redis: RedisService,
  ) {
    this.redis.fromEvent(REDIS_SOCKET_SEND).pipe(tap(this.SEND)).subscribe();
    this.redis.fromEvent(REDIS_SOCKET_EMIT).pipe(tap(this.EMIT)).subscribe();
    this.redis.fromEvent(REDIS_SOCKET_AUTH).pipe(tap(this.AUTH)).subscribe();
  }

  /**
   * Inject socket server
   * @param {Server} server
   */
  public injectSocketServer(server: Server): RedisPropagatorService {
    this.server = server;

    return this;
  }

  /**
   * Send event to single client
   * @param {RedisSend} payload
   */
  private SEND = (payload: RedisSend): void => {
    const { profile, event, data, socket } = payload;
    const sock = socket;

    return this.socket
      .get(profile)
      .filter((socket) => socket.id !== sock)
      .forEach((socket) => socket.emit(event, data));
  };

  /**
   * Send event to all clients
   * @param {RedisEmit} payload
   */
  private EMIT = (payload: RedisEmit): void => {
    this.server.emit(payload.event, payload.data);
  };

  /**
   * Send event to auth clients
   * @param {RedisEmit} payload
   */
  private AUTH = (payload: RedisEmit): void => {
    const { event, data } = payload;

    return this.socket.all().forEach((socket) => socket.emit(event, data));
  };

  /**
   *
   * @param {RedisSend} payload
   */
  public propagate(payload: RedisSend): boolean {
    if (!payload.profile) return false;

    this.redis.publish(REDIS_SOCKET_SEND, payload);

    return true;
  }

  /**
   * Emitter for auth clients
   * @param {RedisEmit} payload
   */
  public EMIT_AUTH(payload: RedisEmit): boolean {
    this.redis.publish(REDIS_SOCKET_AUTH, payload);

    return true;
  }

  /**
   * Emitter for all clients
   * @param {RedisEmit} payload
   */
  public EMIT_ALL(payload: RedisEmit): boolean {
    this.redis.publish(REDIS_SOCKET_EMIT, payload);

    return true;
  }
}
