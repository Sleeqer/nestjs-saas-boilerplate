import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { ReportEvent } from '../event';
import { ReportEventEnum } from '../enum';
import { Report } from '../report.entity';
import { ReportService } from '../report.service';
import { EXCHANGE, KEY } from '../handler/report.handler.enum';
import { RabbitMQService } from '../../../adapters/rabbitmq/rabbitmq.service';

/**
 * Report Listener Class
 */
@Injectable()
export class ReportListener {
  /**
   * Constructor of Report Listener Class
   * @param {ReportService} service Report Service
   * @param {RabbitMQService} rabbit RabbitMQ Service
   * @param {Logger} logger Logger
   */
  constructor(
    private readonly service: ReportService,
    private readonly rabbit: RabbitMQService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Report Created Event Listener
   * @param {ReportEvent} payload
   */
  @OnEvent(ReportEventEnum.CREATED)
  _created(payload: ReportEvent<Report>): void {
    // this.rabbit.send(payload, KEY.CREATED, EXCHANGE.CREATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Report Updated Event Listener
   * @param {ReportEvent} payload
   */
  @OnEvent(ReportEventEnum.UPDATED)
  _updated(payload: ReportEvent<Report>): void {
    // this.rabbit.send(payload, KEY.UPDATED, EXCHANGE.UPDATED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }

  /**
   * Report Deleted Event Listener
   * @param {ReportCreatedEvent} payload
   */
  @OnEvent(ReportEventEnum.DELETED)
  _deleted(payload: ReportEvent<Report>): void {
    // this.rabbit.send(payload, KEY.DELETED, EXCHANGE.DELETED);
    this.logger.info(`[${payload.title}] -> ${JSON.stringify(payload)}`);
  }
}
