import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../redis/propagator/redis.propagator.module';
import { SocketStateModule } from '../socket/state/socket.state.module';
import { SocketModule } from '../socket/socket.module';
import { RedisModule } from '../redis/redis.module';

/**
 * Define module
 */
@Module({
  imports: [
    RedisModule,
    RedisPropagatorModule,
    SocketModule,
    SocketStateModule,
  ],
  exports: [
    RedisModule,
    RedisPropagatorModule,
    SocketModule,
    SocketStateModule,
  ],
})

/**
 * Export module
 */
export class SharedModule {}
