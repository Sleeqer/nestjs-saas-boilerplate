import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { UserHandler } from './handler/user.handler';
import { UserListener } from './listener/user.listener';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User, UserSchema } from './user.entity';

/**
 * Define module
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [
    UserService,
    UserListener,
    UserResolver,
    UserHandler,
  ],
  exports: [UserService],
  controllers: [UserController],
})

/**
 * Export module
 */
export class UserModule {}
