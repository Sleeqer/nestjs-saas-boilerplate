import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../redis/propagator/redis.propagator.module';
import { RabbitMQService } from './rabbitmq.service';

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
