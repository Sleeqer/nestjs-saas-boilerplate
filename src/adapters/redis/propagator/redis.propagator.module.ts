import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { SocketStateService } from '../../socket/state/socket.state.service';
import { RedisPropagatorService } from './redis.propagator.service';
import { RedisModule } from '../redis.module';

/**
 * Define module
 */
@Module({
  imports: [RedisModule],
  providers: [RedisPropagatorService, SocketStateService],
  exports: [RedisPropagatorService],
})

/**
 * Export module
 */
export class RedisPropagatorModule {}
