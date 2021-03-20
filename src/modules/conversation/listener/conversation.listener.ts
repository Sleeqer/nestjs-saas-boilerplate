import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { ConversationService } from '../conversation.service';
import { RabbitMQService } from '../../../adapters/rabbitmq';
import { Conversation } from '../conversation.entity';
import { ConversationEventEnum } from '../enum';
import { ConversationEvent } from '../';

/**
 * Conversation Listener Class
 */
@Injectable()
export class ConversationListener {
  /**
   * Constructor of Conversation Listener Class
   * @param {ConversationService} service Conversation Service
   * @param {RabbitMQService} rabbit RabbitMQ Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly service: ConversationService,
    private readonly rabbit: RabbitMQService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Conversation Created Event Listener
   * @param {ConversationEvent} payload
   */
  @OnEvent(ConversationEventEnum.CREATED)
  _created(payload: ConversationEvent<Conversation>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Conversation Updated Event Listener
   * @param {ConversationEvent} payload
   */
  @OnEvent(ConversationEventEnum.UPDATED)
  _updated(payload: ConversationEvent<Conversation>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Conversation Deleted Event Listener
   * @param {ConversationCreatedEvent} payload
   */
  @OnEvent(ConversationEventEnum.DELETED)
  _deleted(payload: ConversationEvent<Conversation>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
