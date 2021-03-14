import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { OrganizationHandler } from './handler/organization.handler';
import { OrganizationListener } from './listener/organization.listener';
import { OrganizationController } from './organization.controller';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';
import { Organization, OrganizationSchema } from './organization.entity';

/**
 * Define module
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [
    OrganizationService,
    OrganizationListener,
    OrganizationResolver,
    OrganizationHandler,
  ],
  exports: [OrganizationService],
  controllers: [OrganizationController],
})

/**
 * Export module
 */
export class OrganizationModule {}
