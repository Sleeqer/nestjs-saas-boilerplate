import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RabbitMQService } from './rabbitmq.service';

/**
 * Define module
 */
@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})

/**
 * Export module
 */
export class RabbitMQModule {}
