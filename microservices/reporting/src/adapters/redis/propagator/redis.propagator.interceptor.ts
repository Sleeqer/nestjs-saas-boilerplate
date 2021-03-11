import { WsResponse } from '@nestjs/websockets';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { AuthenticatedSocket } from '../../socket/state/socket.state.adapter';
import { RedisPropagatorService } from './redis.propgator.service';

/**
 * Redis Propagator Interceptor Class
 */
@Injectable()
export class RedisPropagatorInterceptor<T>
  implements NestInterceptor<T, WsResponse<T>> {
  /**
   * Constructor of Redis Propagator Interceptor Class
   * @param {RedisPropagatorService} propagator Redis Propagator Service
   */
  public constructor(private readonly propagator: RedisPropagatorService) {}

  /**
   * Interceptor
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   */
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WsResponse<T>> {
    const socket: AuthenticatedSocket = context.switchToWs().getClient();

    return next.handle().pipe(
      tap((data) => {
        this.propagator.propagate({
          ...data,
          socket: socket.id,
          profile: socket.auth?.profile,
        });
      }),
    );
  }
}
