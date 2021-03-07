import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { EntityEvent } from '../event';
import { EntityEventEnum } from '../enum';
import { Entity } from '../entity.entity';
import { EntityService } from '../entity.service';
import { RabbitMQService } from '../../../adapters/rabbitmq/rabbitmq.service';
import { RedisPropagatorService } from 'src/adapters/redis/propagator/redis.propgator.service';

/**
 * Entity Listener Class
 */
@Injectable()
export class EntityListener {
  /**
   * Constructor of Entity Listener Class
   * @param {EntityService} service Entity Service
   * @param {RabbitMQService} rabbit RabbitMQ Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly propagator: RedisPropagatorService,
    private readonly service: EntityService,
    private readonly rabbit: RabbitMQService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Entity Created Event Listener
   * @param {EntityEvent} payload
   */
  @OnEvent(EntityEventEnum.CREATED)
  _created(payload: EntityEvent<Entity>): void {
    this.rabbit.send(payload, 'x', 'exchangg');
    this.propagator.EMIT_ALL({ event: payload.title, data: payload.entity });
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Entity Updated Event Listener
   * @param {EntityEvent} payload
   */
  @OnEvent(EntityEventEnum.UPDATED)
  _updated(payload: EntityEvent<Entity>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Entity Deleted Event Listener
   * @param {EntityCreatedEvent} payload
   */
  @OnEvent(EntityEventEnum.DELETED)
  _deleted(payload: EntityEvent<Entity>): void {
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
