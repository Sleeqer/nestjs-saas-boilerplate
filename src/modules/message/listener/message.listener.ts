import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { MessageEvent } from '../event';
import { MessageEventEnum } from '../enum';
import { Message } from '../message.entity';
import { MessageService } from '../message.service';
import { RabbitMQService } from '../../../adapters/rabbitmq/rabbitmq.service';

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
    // this.rabbit.send(payload, KEY.CREATED, EXCHANGE.CREATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Message Updated Event Listener
   * @param {MessageEvent} payload
   */
  @OnEvent(MessageEventEnum.UPDATED)
  _updated(payload: MessageEvent<Message>): void {
    // this.rabbit.send(payload, KEY.UPDATED, EXCHANGE.UPDATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Message Deleted Event Listener
   * @param {MessageCreatedEvent} payload
   */
  @OnEvent(MessageEventEnum.DELETED)
  _deleted(payload: MessageEvent<Message>): void {
    // this.rabbit.send(payload, KEY.DELETED, EXCHANGE.DELETED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
