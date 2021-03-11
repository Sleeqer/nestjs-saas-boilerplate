import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RedisModule } from '../redis.module';
import { RedisPropagatorService } from './redis.propgator.service';
import { SocketStateService } from '../../socket/state/socket.state.service';

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
