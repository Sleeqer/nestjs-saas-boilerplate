import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { MessageListener } from './listener/message.listener';
import { RedisPropagatorModule } from '../../adapters/redis';
import { MessageHandler } from './handler/message.handler';
import { Message, MessageSchema } from './message.entity';
import { RabbitMQModule } from '../../adapters/rabbitmq';
import { MessageController } from './message.controller';
import { ConversationModule } from '../conversation';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

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
  providers: [MessageService, MessageListener, MessageResolver, MessageHandler],
  exports: [MessageService],
  controllers: [MessageController],
})

/**
 * Export module
 */
export class MessageModule {}
