import { Types } from 'mongoose';

/**
 * Import local objects
 */
import { OrganizationEventEnum } from '../enum';

/**
 * Organization Event Class
 */
export class OrganizationEvent<Organization> {
  /**
   * Title field
   */
  title: OrganizationEventEnum;

  /**
   * Entity field
   */
  entity?: Organization | number | string | Types.ObjectId;

  /**
   * Constructor of Organization Event Class
   * @param {OrganizationEventEnum} title Event's title
   * @param {Organization} entity Event's entity
   */
  constructor(
    title: OrganizationEventEnum = OrganizationEventEnum.CREATED,
    entity?: Organization | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
