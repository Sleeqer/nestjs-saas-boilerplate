import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { UserEvent } from '../event';
import { UserEventEnum } from '../enum';
import { User } from '../user.entity';
import { UserService } from '../user.service';
import { EXCHANGE, KEY } from '../handler/user.handler.enum';
import { RabbitMQService } from '../../../adapters/rabbitmq/rabbitmq.service';

/**
 * User Listener Class
 */
@Injectable()
export class UserListener {
  /**
   * Constructor of User Listener Class
   * @param {UserService} service User Service
   * @param {RabbitMQService} rabbit RabbitMQ Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly service: UserService,
    private readonly rabbit: RabbitMQService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * User Created Event Listener
   * @param {UserEvent} payload
   */
  @OnEvent(UserEventEnum.CREATED)
  _created(payload: UserEvent<User>): void {
    // this.rabbit.send(payload, KEY.CREATED, EXCHANGE.CREATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * User Updated Event Listener
   * @param {UserEvent} payload
   */
  @OnEvent(UserEventEnum.UPDATED)
  _updated(payload: UserEvent<User>): void {
    // this.rabbit.send(payload, KEY.UPDATED, EXCHANGE.UPDATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * User Deleted Event Listener
   * @param {UserCreatedEvent} payload
   */
  @OnEvent(UserEventEnum.DELETED)
  _deleted(payload: UserEvent<User>): void {
    // this.rabbit.send(payload, KEY.DELETED, EXCHANGE.DELETED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
