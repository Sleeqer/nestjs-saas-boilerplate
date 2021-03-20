import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { RabbitMQService } from '../../../adapters/rabbitmq';
import { MessageService, Message, MessageEvent } from '../';
import { MessageEventEnum } from '../enum';

/**
 * Message Listener Class
 */
@Injectable()
export class MessageListener {
  /**
   * Constructor of Message Listener Class
   * @param {MessageService} service Message Service
   * @param {RabbitMQService} rabbit RabbitMQ Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly service: MessageService,
    private readonly rabbit: RabbitMQService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Message Created Event Listener
   * @param {MessageEvent} payload
   */
  @OnEvent(MessageEventEnum.CREATED)
  _created(payload: MessageEvent<Message>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Message Updated Event Listener
   * @param {MessageEvent} payload
   */
  @OnEvent(MessageEventEnum.UPDATED)
  _updated(payload: MessageEvent<Message>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Message Deleted Event Listener
   * @param {MessageCreatedEvent} payload
   */
  @OnEvent(MessageEventEnum.DELETED)
  _deleted(payload: MessageEvent<Message>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
