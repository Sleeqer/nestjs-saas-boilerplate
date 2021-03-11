import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { ConversationHandler } from './handler/conversation.handler';
import { ConversationListener } from './listener/conversation.listener';
import { ConversationController } from './conversation.controller';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';
import { Conversation, ConversationSchema } from './conversation.entity';

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
