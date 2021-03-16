import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

/**
 * Import local modules
 */
import { ConversationPopulatorEnum } from './enum';
import { BaseEntityService } from '../common/entity/service';
import { Conversation, ConversationDocument } from './conversation.entity';

/**
 * Conversation Service Class
 */
@Injectable()
export class ConversationService extends BaseEntityService<ConversationDocument> {
  /**
   * Conversation
   */
  protected entity: string = 'Conversation';

  /**
   * Populator
   */
  protected populator: Array<string> = [
    ConversationPopulatorEnum.MEMBERS_USER,
    ConversationPopulatorEnum.OWNER,
  ];

  /**
   * Constructor of Conversation Service Class
   * @param {Model<Conversation>} repository Conversation repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(Conversation.name)
    protected readonly repository: Model<ConversationDocument>,
    protected readonly emitter: EventEmitter2,
  ) {
    super(repository, emitter);
  }
}
