import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

/**
 * Import local modules
 */
import { Conversation } from '../conversation/conversation.entity';
import { BaseEntityService } from '../common/entity/service';
import { Message, MessageDocument } from './message.entity';
import { Payload } from '../common/entity/controller';
import { MessagePopulatorEnum } from './enum';

/**
 * Message Service Class
 */
@Injectable()
export class MessageService extends BaseEntityService<MessageDocument> {
  /**
   * Message
   */
  protected entity: string = 'Message';

  /**
   * Populator
   */
  protected populator: Array<string> = [MessagePopulatorEnum.AUTHOR];

  /**
   * Constructor of Message Service Class
   * @param {Model<Message>} repository Message repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(Message.name)
    protected readonly repository: Model<MessageDocument>,
    protected readonly emitter: EventEmitter2,
  ) {
    super(repository, emitter);
  }

  /**
   * Find Message's object
   * @param {Conversation} conversation Conversation's object
   * @param {Message} message Message's object
   * @returns {Message} Message's object
   */
  finder(conversation: Conversation, message: Message): Message {
    const { _id } = conversation;

    /**
     * Validate if message is part of conversation
     */
    if (!(_id as Types.ObjectId).equals(message.conversation as Types.ObjectId))
      throw this._NotFoundException();

    return message;
  }

  /**
   * Updater Message's object
   * @param {Message} message Message's object
   * @param {Payload} payload Payload's object
   * @returns {Message} Message's object
   */
  updater(message: Message, payload: Payload): Message {
    console.log(payload);
    message.content = payload.content || message.content;
    return message;
  }
}
