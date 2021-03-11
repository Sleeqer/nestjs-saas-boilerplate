import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { OrganizationEvent } from '../event';
import { OrganizationEventEnum } from '../enum';
import { Organization } from '../organization.entity';
import { OrganizationService } from '../organization.service';
import { EXCHANGE, KEY } from '../handler/organization.handler.enum';
import { RabbitMQService } from '../../../adapters/rabbitmq/rabbitmq.service';

/**
 * Organization Listener Class
 */
@Injectable()
export class OrganizationListener {
  /**
   * Constructor of Organization Listener Class
   * @param {OrganizationService} service Organization Service
   * @param {RabbitMQService} rabbit RabbitMQ Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly service: OrganizationService,
    private readonly rabbit: RabbitMQService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Organization Created Event Listener
   * @param {OrganizationEvent} payload
   */
  @OnEvent(OrganizationEventEnum.CREATED)
  _created(payload: OrganizationEvent<Organization>): void {
    // this.rabbit.send(payload, KEY.CREATED, EXCHANGE.CREATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Organization Updated Event Listener
   * @param {OrganizationEvent} payload
   */
  @OnEvent(OrganizationEventEnum.UPDATED)
  _updated(payload: OrganizationEvent<Organization>): void {
    // this.rabbit.send(payload, KEY.UPDATED, EXCHANGE.UPDATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Organization Deleted Event Listener
   * @param {OrganizationCreatedEvent} payload
   */
  @OnEvent(OrganizationEventEnum.DELETED)
  _deleted(payload: OrganizationEvent<Organization>): void {
    // this.rabbit.send(payload, KEY.DELETED, EXCHANGE.DELETED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
