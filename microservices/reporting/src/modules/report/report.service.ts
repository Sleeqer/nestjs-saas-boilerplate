import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

/**
 * Import local modules
 */
import { BaseEntityService } from '../common/entity/service';
import { Report, ReportDocument } from './report.entity';

/**
 * Report Service Class
 */
@Injectable()
export class ReportService extends BaseEntityService<ReportDocument> {
  /**
   * Report
   */
  protected entity: string = 'Report';

  /**
   * Constructor of Report Service Class
   * @param {Model<Report>} repository Report repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(Report.name)
    protected readonly repository: Model<ReportDocument>,
    protected readonly emitter: EventEmitter2,
  ) {
    super(repository, emitter);
  }
}
