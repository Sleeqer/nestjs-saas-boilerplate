import { ObjectID } from 'typeorm';

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
   * Profile field
   */
  entity?: Profile | number | string | ObjectID;

  /**
   * Constructor of Profile Created Event Class
   * @param {Profile} entity
   */
  constructor(
    title: ProfileEventEnum = ProfileEventEnum.CREATED,
    entity?: Profile | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
