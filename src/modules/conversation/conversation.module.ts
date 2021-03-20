import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { Conversation, ConversationSchema } from './conversation.entity';
import { ConversationListener } from './listener/conversation.listener';
import { ConversationHandler } from './handler/conversation.handler';
import { ConversationController } from './conversation.controller';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';
import { RedisPropagatorModule } from '../../adapters/redis';
import { RabbitMQModule } from '../../adapters/rabbitmq';

/**
 * Define module
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [
    ConversationService,
    ConversationListener,
    ConversationResolver,
    ConversationHandler,
  ],
  exports: [ConversationService],
  controllers: [ConversationController],
})

/**
 * Export module
 */
export class ConversationModule {}
