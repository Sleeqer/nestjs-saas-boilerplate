import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { EntityListener } from './listener/entity.listener';
import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';
import { Entity } from './entity.entity';

/**
 * Define module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Entity]), RabbitMQModule],
  providers: [EntityService, EntityListener],
  exports: [EntityService],
  controllers: [EntityController],
})

/**
 * Export module
 */
export class EntityModule {}
