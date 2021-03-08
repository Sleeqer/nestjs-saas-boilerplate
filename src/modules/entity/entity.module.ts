import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { EntityHandler } from './handler/entity.handler';
import { EntityListener } from './listener/entity.listener';
import { EntityController } from './entity.controller';
import { EntityResolver } from './entity.resolver';
import { EntityService } from './entity.service';
import { Entity } from './entity.entity';

/**
 * Define module
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Entity]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [EntityService, EntityListener, EntityResolver, EntityHandler],
  exports: [EntityService],
  controllers: [EntityController],
})

/**
 * Export module
 */
export class EntityModule {}
