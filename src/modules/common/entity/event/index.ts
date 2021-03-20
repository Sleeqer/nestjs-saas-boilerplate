import { Types } from 'mongoose';

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
  entity?: Entity | number | string | Types.ObjectId;

  /**
   * Constructor of Entity Event Class
   * @param {EntityEventEnum} title Event's title
   * @param {Entity} entity Event's entity
   */
  constructor(
    title: EntityEventEnum = EntityEventEnum.CREATED,
    entity?: Entity | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
