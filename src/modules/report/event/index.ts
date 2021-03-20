import { Types } from 'mongoose';

/**
 * Import local objects
 */
import { ReportEventEnum } from '../enum';

/**
 * Report Event Class
 */
export class ReportEvent<Report> {
  /**
   * Title field
   */
  title: ReportEventEnum;

  /**
   * Entity field
   */
  entity?: Report | number | string | Types.ObjectId;

  /**
   * Constructor of Report Event Class
   * @param {ReportEventEnum} title Event's title
   * @param {Report} entity Event's entity
   */
  constructor(
    title: ReportEventEnum = ReportEventEnum.CREATED,
    entity?: Report | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
