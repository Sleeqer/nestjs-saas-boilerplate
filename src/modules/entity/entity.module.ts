import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis';
import { EntityListener } from './listener/entity.listener';
import { RabbitMQModule } from '../../adapters/rabbitmq';
import { EntityHandler } from './handler/entity.handler';
import { EntityController } from './entity.controller';
import { Entity, EntitySchema } from './entity.entity';
import { EntityService } from './entity.service';

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
