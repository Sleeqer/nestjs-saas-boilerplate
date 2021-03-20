import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';

/**
 * Conversation Resolver Class
 */
@Resolver(() => Conversation)
export class ConversationResolver {
  /**
   * Constructor of Conversation Resolver Class
   * @param {ConversationService} service Conversation Service
   */
  constructor(private readonly service: ConversationService) {}

  /**
   * Retrieve conversations
   * @returns
   */
  @Query((returns) => [Conversation], {
    name: 'conversations',
    nullable: false,
  })
  async conversations() {
    return this.service.all();
  }
}
