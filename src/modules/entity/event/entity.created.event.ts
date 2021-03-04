/**
 * Import local level objects
 */
import { EntityEventEnum } from '../enum';

/**
 * Entity Created Event Class
 */
export class EntityCreatedEvent {
  /**
   * Title field
   */
  title: string = EntityEventEnum.CREATED;

  /**
   * Entity field
   */
  entity?: object = {};
}
