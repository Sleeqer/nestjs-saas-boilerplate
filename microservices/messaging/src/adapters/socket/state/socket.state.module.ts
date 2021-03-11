import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { SocketStateService } from './socket.state.service';

/**
 * Define module
 */
@Module({
  providers: [SocketStateService],
  exports: [SocketStateService],
})

/**
 * Export module
 */
export class SocketStateModule {}
