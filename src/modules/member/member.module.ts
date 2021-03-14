import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { Member, MemberSchema } from './member.entity';
import { MemberStrategy } from './strategy/member.strategy';
import { MemberListener } from './listener/member.listener';
import { MemberHandler } from './handler/member.handler';
import { MemberController } from './member.controller';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';

/**
 * Define module
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
    ]),
    RabbitMQModule,
    RedisPropagatorModule,
  ],
  providers: [
    MemberService,
    MemberListener,
    MemberResolver,
    MemberHandler,
    MemberStrategy,
  ],
  exports: [MemberService],
  controllers: [MemberController],
})

/**
 * Export module
 */
export class MemberModule { }
