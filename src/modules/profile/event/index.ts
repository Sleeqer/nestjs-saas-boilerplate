import { Types } from 'mongoose';

/**
 * Import local objects
 */
import { ProfileEventEnum } from '../enum';

/**
 * Profile Event Class
 */
export class ProfileEvent<Profile> {
  /**
   * Title field
   */
  title: ProfileEventEnum;

  /**
   * Entity field
   */
  entity?: Profile | number | string | Types.ObjectId;

  /**
   * Constructor of Profile Event Class
   * @param {ProfileEventEnum} title Event's title
   * @param {Profile} entity Event's entity
   */
  constructor(
    title: ProfileEventEnum = ProfileEventEnum.CREATED,
    entity?: Profile | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
