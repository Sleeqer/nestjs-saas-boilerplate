import { Types } from 'mongoose';

/**
 * Import local objects
 */
import { MessageEventEnum } from '../enum';

/**
 * Message Event Class
 */
export class MessageEvent<Message> {
  /**
   * Title field
   */
  title: MessageEventEnum;

  /**
   * Entity field
   */
  entity?: Message | number | string | Types.ObjectId;

  /**
   * Constructor of Message Event Class
   * @param {MessageEventEnum} title Event's title
   * @param {Message} entity Event's entity
   */
  constructor(
    title: MessageEventEnum = MessageEventEnum.CREATED,
    entity?: Message | number | string | Types.ObjectId,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
