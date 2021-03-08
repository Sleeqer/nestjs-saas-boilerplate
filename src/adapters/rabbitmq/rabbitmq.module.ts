import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RabbitMQService } from './rabbitmq.service';
import { RedisPropagatorModule } from '../redis/propagator/redis.propagator.module';

/**
 * Define module
 */
@Module({
  imports: [RedisPropagatorModule],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})

/**
 * Export module
 */
export class RabbitMQModule {}
