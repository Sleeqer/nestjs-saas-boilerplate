import { ObjectID } from 'typeorm';

/**
 * Import local objects
 */
import { ConversationEventEnum } from '../enum';

/**
 * Conversation Event Class
 */
export class ConversationEvent<Conversation> {
  /**
   * Title field
   */
  title: ConversationEventEnum;

  /**
   * Conversation field
   */
  entity?: Conversation | number | string | ObjectID;

  /**
   * Constructor of Conversation Created Event Class
   * @param {Conversation} entity
   */
  constructor(
    title: ConversationEventEnum = ConversationEventEnum.CREATED,
    entity?: Conversation | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
