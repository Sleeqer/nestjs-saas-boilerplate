import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { ApplicationHandler } from './handler/application.handler';
import { ApplicationListener } from './listener/application.listener';
import { ApplicationController } from './application.controller';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from './application.service';
import { Application, ApplicationSchema } from './application.entity';

/**
 * Define module
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [
    ApplicationService,
    ApplicationListener,
    ApplicationResolver,
    ApplicationHandler,
  ],
  exports: [ApplicationService],
  controllers: [ApplicationController],
})

/**
 * Export module
 */
export class ApplicationModule {}
