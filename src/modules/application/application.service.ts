import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

/**
 * Import local modules
 */
import { Application, ApplicationDocument } from './application.entity';
import { BaseEntityService } from '../common/entity/service';

/**
 * Application Service Class
 */
@Injectable()
export class ApplicationService extends BaseEntityService<ApplicationDocument> {
  /**
   * Application
   */
  protected entity: string = 'Application';

  /**
   * Constructor of Application Service Class
   * @param {Model<Application>} repository Application Repository
   * @param {EventEmitter2} emitter Event Emitter
   */
  constructor(
    @InjectModel(Application.name)
    protected readonly repository: Model<ApplicationDocument>,
    protected readonly emitter: EventEmitter2,
  ) {
    super(repository, emitter);
  }
}
