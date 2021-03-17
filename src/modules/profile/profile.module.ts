import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { Profile, ProfileSchema } from './profile.entity';
import { ProfileStrategy } from './strategy/profile.strategy';
import { ProfileListener } from './listener/profile.listener';
import { ProfileHandler } from './handler/profile.handler';
import { ProfileController } from './profile.controller';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

/**
 * Define module
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
    ]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [
    ProfileService,
    ProfileListener,
    ProfileResolver,
    ProfileHandler,
    ProfileStrategy,
  ],
  exports: [ProfileService],
  controllers: [ProfileController],
})

/**
 * Export module
 */
export class ProfileModule { }
