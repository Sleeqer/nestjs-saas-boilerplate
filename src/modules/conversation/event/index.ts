import { Types } from 'mongoose';

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
   * Entity field
   */
  entity?: Conversation | number | string | Types.ObjectId;

  /**
   * Constructor of Conversation Event Class
   * @param {ConversationEventEnum} title Event's title
   * @param {Conversation} entity Event's entity
   */
  constructor(
    title: ConversationEventEnum = ConversationEventEnum.CREATED,
    entity?: Conversation | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
