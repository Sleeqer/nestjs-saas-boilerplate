import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local level objects
 */
import {
  EntityCreatedEvent,
  EntityDestroyedEvent,
  EntityUpdatedEvent,
} from '../event';
import { EntityEventEnum } from '../enum';
import { EntityService } from '../entity.service';

/**
 * Entity Listener Class
 */
@Injectable()
export class EntityListener {
  /**
   * Constructor of Entity Listener Class
   * @param {EntityService} service Entity Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly service: EntityService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Entity Created Event Listener
   * @param {EntityCreatedEvent} payload
   */
  @OnEvent(EntityEventEnum.CREATED)
  _created(payload: EntityCreatedEvent): void {
    this.logger.info(`[${payload.title}]: _`);
  }

  /**
   * Entity Updated Event Listener
   * @param {EntityCreatedEvent} payload
   */
  @OnEvent(EntityEventEnum.UPDATED)
  _updated(payload: EntityUpdatedEvent): void {
    this.logger.info(`[${payload.title}]: _`);
  }

  /**
   * Entity Destroyed Event Listener
   * @param {EntityCreatedEvent} payload
   */
  @OnEvent(EntityEventEnum.DESTROYED)
  _destroyed(payload: EntityDestroyedEvent): void {
    this.logger.info(`[${payload.title}]: _`);
  }
}
