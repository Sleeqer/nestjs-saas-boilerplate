import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { SocketGateway } from './socket.gateway';

/**
 * Define module
 */
@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateway],
})

/**
 * Export module
 */
export class SocketModule {}
