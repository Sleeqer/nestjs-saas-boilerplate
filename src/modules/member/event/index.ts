import { Types } from 'mongoose';

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
   * Entity field
   */
  entity?: Member | number | string | Types.ObjectId;

  /**
   * Constructor of Member Event Class
   * @param {MemberEventEnum} title Event's title
   * @param {Member} entity Event's entity
   */
  constructor(
    title: MemberEventEnum = MemberEventEnum.CREATED,
    entity?: Member | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
