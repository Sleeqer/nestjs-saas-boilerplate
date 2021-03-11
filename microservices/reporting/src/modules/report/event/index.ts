import { ObjectID } from 'typeorm';

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
   * Report field
   */
  entity?: Report | number | string | ObjectID;

  /**
   * Constructor of Report Created Event Class
   * @param {Report} entity
   */
  constructor(
    title: ReportEventEnum = ReportEventEnum.CREATED,
    entity?: Report | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
