import { MongooseModule } from '@nestjs/mongoose';
import { Module, Global } from '@nestjs/common';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis';
import { MemberListener } from './listener/member.listener';
import { MemberHandler } from './handler/member.handler';
import { RabbitMQModule } from '../../adapters/rabbitmq';
import { Member, MemberSchema } from './member.entity';
import { MemberController } from './member.controller';
import { ConversationModule } from '../conversation';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';

/**
 * Define module
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    RabbitMQModule,
    RedisPropagatorModule,
    ConversationModule,
  ],
  providers: [MemberService, MemberListener, MemberResolver, MemberHandler],
  exports: [MemberService],
  controllers: [MemberController],
})

/**
 * Export module
 */
export class MemberModule {}
