import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { ApplicationEvent } from '../event';
import { ApplicationEventEnum } from '../enum';
import { Application } from '../application.entity';
import { ApplicationService } from '../application.service';
import { EXCHANGE, KEY } from '../handler/application.handler.enum';
import { RabbitMQService } from '../../../adapters/rabbitmq/rabbitmq.service';

/**
 * Application Listener Class
 */
@Injectable()
export class ApplicationListener {
  /**
   * Constructor of Application Listener Class
   * @param {ApplicationService} service Application Service
   * @param {RabbitMQService} rabbit RabbitMQ Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly service: ApplicationService,
    private readonly rabbit: RabbitMQService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Application Created Event Listener
   * @param {ApplicationEvent} payload
   */
  @OnEvent(ApplicationEventEnum.CREATED)
  _created(payload: ApplicationEvent<Application>): void {
    // this.rabbit.send(payload, KEY.CREATED, EXCHANGE.CREATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Application Updated Event Listener
   * @param {ApplicationEvent} payload
   */
  @OnEvent(ApplicationEventEnum.UPDATED)
  _updated(payload: ApplicationEvent<Application>): void {
    // this.rabbit.send(payload, KEY.UPDATED, EXCHANGE.UPDATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Application Deleted Event Listener
   * @param {ApplicationCreatedEvent} payload
   */
  @OnEvent(ApplicationEventEnum.DELETED)
  _deleted(payload: ApplicationEvent<Application>): void {
    // this.rabbit.send(payload, KEY.DELETED, EXCHANGE.DELETED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
