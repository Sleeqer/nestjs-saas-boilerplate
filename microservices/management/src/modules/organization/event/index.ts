import { ObjectID } from 'typeorm';

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
   * Organization field
   */
  entity?: Organization | number | string | ObjectID;

  /**
   * Constructor of Organization Created Event Class
   * @param {Organization} entity
   */
  constructor(
    title: OrganizationEventEnum = OrganizationEventEnum.CREATED,
    entity?: Organization | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
