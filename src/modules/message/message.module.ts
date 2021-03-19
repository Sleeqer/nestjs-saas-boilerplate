import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { Message, MessageSchema } from './message.entity';
import { MessageStrategy } from './strategy/message.strategy';
import { MessageListener } from './listener/message.listener';
import { MessageHandler } from './handler/message.handler';
import { MessageController } from './message.controller';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { ConversationModule } from '../conversation';

/**
 * Define module
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    RabbitMQModule,
    RedisPropagatorModule,
    ConversationModule,
  ],
  providers: [
    MessageService,
    MessageListener,
    MessageResolver,
    MessageHandler,
    MessageStrategy,
  ],
  exports: [MessageService],
  controllers: [MessageController],
})

/**
 * Export module
 */
export class MessageModule {}
