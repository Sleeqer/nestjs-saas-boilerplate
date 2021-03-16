import { LeanDocument } from 'mongoose';
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
  entity?: Entity | LeanDocument<Entity> | number | string | ObjectID;

  /**
   * Constructor of Entity Event Class
   * @param {EntityEventEnum} title
   * @param {Entity | LeanDocument<Entity> | number | string | ObjectID} entity
   */
  constructor(
    title: EntityEventEnum = EntityEventEnum.CREATED,
    entity?: Entity | LeanDocument<Entity> | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
