import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis';
import { RabbitMQModule } from '../../adapters/rabbitmq';
import { UserListener } from './listener/user.listener';
import { UserHandler } from './handler/user.handler';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

/**
 * Define module
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [UserService, UserListener, UserResolver, UserHandler],
  exports: [UserService],
  controllers: [UserController],
})

/**
 * Export module
 */
export class UserModule {}
