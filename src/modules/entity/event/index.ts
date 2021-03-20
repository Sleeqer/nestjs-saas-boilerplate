import { LeanDocument, Types } from 'mongoose';

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
  entity?: Entity | LeanDocument<Entity> | number | string | Types.ObjectId;

  /**
   * Constructor of Entity Event Class
   * @param {EntityEventEnum} title
   * @param {Entity | LeanDocument<Entity> | number | string | Types.ObjectId} entity
   */
  constructor(
    title: EntityEventEnum = EntityEventEnum.CREATED,
    entity?: Entity | LeanDocument<Entity> | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
