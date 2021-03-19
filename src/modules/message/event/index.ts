import { ObjectID } from 'typeorm';

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
   * Message field
   */
  entity?: Message | number | string | ObjectID;

  /**
   * Constructor of Message Created Event Class
   * @param {Message} entity
   */
  constructor(
    title: MessageEventEnum = MessageEventEnum.CREATED,
    entity?: Message | number | string | ObjectID,
  ) {
    this.title = title;
    this.entity = entity;
  }
}
