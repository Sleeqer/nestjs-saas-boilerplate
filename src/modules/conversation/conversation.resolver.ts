import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { Conversation } from './conversation.entity';
import { ConversationService } from './conversation.service';

/**
 * Conversation Resolver Class
 */
@Resolver((of) => Conversation)
export class ConversationResolver {
  /**
   * Constructor of Conversation Resolver Class
   * @param {ConversationService} service Conversation Service
   */
  constructor(private readonly service: ConversationService) {}

  /**
   *
   * @returns
   */
  @Query((returns) => [Conversation], { name: 'conversations', nullable: false })
  async conversations() {
    return this.service.all();
  }
}
