import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { Application, ApplicationSchema } from './application.entity';
import { ApplicationListener } from './listener/application.listener';
import { ApplicationHandler } from './handler/application.handler';
import { ApplicationController } from './application.controller';
import { ApplicationResolver } from './application.resolver';
import { RedisPropagatorModule } from '../../adapters/redis';
import { ApplicationService } from './application.service';
import { RabbitMQModule } from '../../adapters/rabbitmq';

/**
 * Define module
 */
@Global()
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
