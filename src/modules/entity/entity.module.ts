import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { EntityHandler } from './handler/entity.handler';
import { EntityListener } from './listener/entity.listener';
import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';
import { Entity, EntitySchema } from './entity.entity';

/**
 * Define module
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entity.name, schema: EntitySchema }]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [EntityService, EntityListener, EntityHandler, MongooseModule],
  exports: [EntityService],
  controllers: [EntityController],
})

/**
 * Export module
 */
export class EntityModule {}
