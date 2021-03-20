import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { ProfileListener } from './listener/profile.listener';
import { RedisPropagatorModule } from '../../adapters/redis';
import { ProfileHandler } from './handler/profile.handler';
import { ProfileController } from './profile.controller';
import { RabbitMQModule } from '../../adapters/rabbitmq';
import { Profile, ProfileSchema } from './profile.entity';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

/**
 * Define module
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [ProfileService, ProfileListener, ProfileResolver, ProfileHandler],
  exports: [ProfileService],
  controllers: [ProfileController],
})

/**
 * Export module
 */
export class ProfileModule {}
