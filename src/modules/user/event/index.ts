import { Types } from 'mongoose';

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
   * Entity field
   */
  entity?: User | number | string | Types.ObjectId;

  /**
   * Constructor of User Event Class
   * @param {UserEventEnum} title Event's title
   * @param {User} entity Event's entity
   */
  constructor(
    title: UserEventEnum = UserEventEnum.CREATED,
    entity?: User | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
