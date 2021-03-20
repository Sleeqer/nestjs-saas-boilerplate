import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { RabbitMQService } from '../../../adapters/rabbitmq';
import { MemberService } from '../member.service';
import { Member } from '../member.entity';
import { MemberEventEnum } from '../enum';
import { MemberEvent } from '../';

/**
 * Member Listener Class
 */
@Injectable()
export class MemberListener {
  /**
   * Constructor of Member Listener Class
   * @param {MemberService} service Member Service
   * @param {RabbitMQService} rabbit RabbitMQ Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly service: MemberService,
    private readonly rabbit: RabbitMQService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Member Created Event Listener
   * @param {MemberEvent} payload
   */
  @OnEvent(MemberEventEnum.CREATED)
  _created(payload: MemberEvent<Member>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Member Updated Event Listener
   * @param {MemberEvent} payload
   */
  @OnEvent(MemberEventEnum.UPDATED)
  _updated(payload: MemberEvent<Member>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Member Deleted Event Listener
   * @param {MemberCreatedEvent} payload
   */
  @OnEvent(MemberEventEnum.DELETED)
  _deleted(payload: MemberEvent<Member>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
