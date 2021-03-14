import { ObjectID } from 'typeorm';

/**
 * Import local objects
 */
import { MemberEventEnum } from '../enum';

/**
 * Member Event Class
 */
export class MemberEvent<Member> {
  /**
   * Title field
   */
  title: MemberEventEnum;

  /**
   * Member field
   */
  entity?: Member | number | string | ObjectID;

  /**
   * Constructor of Member Created Event Class
   * @param {Member} entity
   */
  constructor(
    title: MemberEventEnum = MemberEventEnum.CREATED,
    entity?: Member | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
