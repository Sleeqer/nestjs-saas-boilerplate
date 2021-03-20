import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { RabbitMQService } from '../../../adapters/rabbitmq';
import { ApplicationService } from '../application.service';
import { Application, ApplicationEvent } from '../';
import { ApplicationEventEnum } from '../enum';

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
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Application Updated Event Listener
   * @param {ApplicationEvent} payload
   */
  @OnEvent(ApplicationEventEnum.UPDATED)
  _updated(payload: ApplicationEvent<Application>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Application Deleted Event Listener
   * @param {ApplicationCreatedEvent} payload
   */
  @OnEvent(ApplicationEventEnum.DELETED)
  _deleted(payload: ApplicationEvent<Application>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
