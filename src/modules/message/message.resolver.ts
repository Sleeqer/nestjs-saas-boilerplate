import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { MessageService } from './message.service';
import { Message } from './message.entity';

/**
 * Message Resolver Class
 */
@Resolver(() => Message)
export class MessageResolver {
  /**
   * Constructor of Message Resolver Class
   * @param {MessageService} service Message Service
   */
  constructor(private readonly service: MessageService) {}

  /**
   * Retrieve messages
   * @returns
   */
  @Query((returns) => [Message], { name: 'messages', nullable: false })
  async messages() {
    return this.service.all();
  }
}
