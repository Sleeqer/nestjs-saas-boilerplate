import { ObjectID } from 'typeorm';

/**
 * Import local objects
 */
import { EntityEventEnum } from '../enum';

/**
 * Entity Event Class
 */
export class EntityEvent<Entity> {
  /**
   * Title field
   */
  title: EntityEventEnum;

  /**
   * Entity field
   */
  entity?: Entity | number | string | ObjectID;

  /**
   * Constructor of Entity Created Event Class
   * @param {Entity} entity
   */
  constructor(
    title: EntityEventEnum = EntityEventEnum.CREATED,
    entity?: Entity | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
