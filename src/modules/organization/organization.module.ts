import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { Organization, OrganizationSchema } from './organization.entity';
import { OrganizationListener } from './listener/organization.listener';
import { OrganizationHandler } from './handler/organization.handler';
import { OrganizationController } from './organization.controller';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';
import { RedisPropagatorModule } from '../../adapters/redis';
import { RabbitMQModule } from '../../adapters/rabbitmq';

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
