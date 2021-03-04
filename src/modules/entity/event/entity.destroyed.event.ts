/**
 * Import local level objects
 */
import { EntityEventEnum } from '../enum';

/**
 * Entity Destroyed Event Class
 */
export class EntityDestroyedEvent {
  /**
   * Title field
   */
  title: string = EntityEventEnum.DESTROYED;

  /**
   * Entity field
   */
  entity?: object = {};
}
