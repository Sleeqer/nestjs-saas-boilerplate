import { ObjectID } from 'typeorm';

/**
 * Import local objects
 */
import { UserEventEnum } from '../enum';

/**
 * User Event Class
 */
export class UserEvent<User> {
  /**
   * Title field
   */
  title: UserEventEnum;

  /**
   * User field
   */
  entity?: User | number | string | ObjectID;

  /**
   * Constructor of User Created Event Class
   * @param {User} entity
   */
  constructor(
    title: UserEventEnum = UserEventEnum.CREATED,
    entity?: User | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
