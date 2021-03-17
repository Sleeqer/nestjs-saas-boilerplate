import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { ProfileEvent } from '../event';
import { ProfileEventEnum } from '../enum';
import { Profile } from '../profile.entity';
import { ProfileService } from '../profile.service';
import { RabbitMQService } from '../../../adapters/rabbitmq/rabbitmq.service';

/**
 * Profile Listener Class
 */
@Injectable()
export class ProfileListener {
  /**
   * Constructor of Profile Listener Class
   * @param {ProfileService} service Profile Service
   * @param {RabbitMQService} rabbit RabbitMQ Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly service: ProfileService,
    private readonly rabbit: RabbitMQService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Profile Created Event Listener
   * @param {ProfileEvent} payload
   */
  @OnEvent(ProfileEventEnum.CREATED)
  _created(payload: ProfileEvent<Profile>): void {
    // this.rabbit.send(payload, KEY.CREATED, EXCHANGE.CREATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Profile Updated Event Listener
   * @param {ProfileEvent} payload
   */
  @OnEvent(ProfileEventEnum.UPDATED)
  _updated(payload: ProfileEvent<Profile>): void {
    // this.rabbit.send(payload, KEY.UPDATED, EXCHANGE.UPDATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Profile Deleted Event Listener
   * @param {ProfileCreatedEvent} payload
   */
  @OnEvent(ProfileEventEnum.DELETED)
  _deleted(payload: ProfileEvent<Profile>): void {
    // this.rabbit.send(payload, KEY.DELETED, EXCHANGE.DELETED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
