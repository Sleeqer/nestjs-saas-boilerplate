import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { OrganizationService, Organization, OrganizationEvent } from '../';
import { RabbitMQService } from '../../../adapters/rabbitmq';
import { OrganizationEventEnum } from '../enum';

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
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Organization Updated Event Listener
   * @param {OrganizationEvent} payload
   */
  @OnEvent(OrganizationEventEnum.UPDATED)
  _updated(payload: OrganizationEvent<Organization>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Organization Deleted Event Listener
   * @param {OrganizationCreatedEvent} payload
   */
  @OnEvent(OrganizationEventEnum.DELETED)
  _deleted(payload: OrganizationEvent<Organization>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
