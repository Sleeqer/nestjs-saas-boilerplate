import { Types } from 'mongoose';

/**
 * Import local objects
 */
import { ApplicationEventEnum } from '../enum';

/**
 * Application Event Class
 */
export class ApplicationEvent<Application> {
  /**
   * Title field
   */
  title: ApplicationEventEnum;

  /**
   * Entity field
   */
  entity?: Application | number | string | Types.ObjectId;

  /**
   * Constructor of Application Event Class
   * @param {ApplicationEventEnum} title Event's title
   * @param {Application} entity Event's entity
   */
  constructor(
    title: ApplicationEventEnum = ApplicationEventEnum.CREATED,
    entity?: Application | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
