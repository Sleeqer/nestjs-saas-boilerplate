import { ObjectID } from 'typeorm';

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
   * Application field
   */
  entity?: Application | number | string | ObjectID;

  /**
   * Constructor of Application Created Event Class
   * @param {Application} entity
   */
  constructor(
    title: ApplicationEventEnum = ApplicationEventEnum.CREATED,
    entity?: Application | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
