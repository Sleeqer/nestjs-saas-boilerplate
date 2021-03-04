/**
 * Import local level objects
 */
import { EntityEventEnum } from '../enum';

/**
 * Entity Updated Event Class
 */
export class EntityUpdatedEvent {
  /**
   * Title field
   */
  title: string = EntityEventEnum.UPDATED;

  /**
   * Entity field
   */
  entity?: object = {};
}
