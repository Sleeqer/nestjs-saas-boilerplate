import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { Application, ApplicationSchema } from './application.entity';
import { ApplicationStrategy } from './strategy/application.strategy';
import { ApplicationListener } from './listener/application.listener';
import { ApplicationHandler } from './handler/application.handler';
import { ApplicationController } from './application.controller';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from './application.service';
import { OrganizationModule } from '../organization';

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
    OrganizationModule,
  ],
  providers: [
    ApplicationService,
    ApplicationListener,
    ApplicationResolver,
    ApplicationHandler,
    ApplicationStrategy,
  ],
  exports: [ApplicationService],
  controllers: [ApplicationController],
})

/**
 * Export module
 */
export class ApplicationModule {}
