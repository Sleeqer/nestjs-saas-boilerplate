import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { Message } from './message.entity';
import { MessageService } from './message.service';

/**
 * Message Resolver Class
 */
@Resolver((of) => Message)
export class MessageResolver {
  /**
   * Constructor of Message Resolver Class
   * @param {MessageService} service Message Service
   */
  constructor(private readonly service: MessageService) {}

  /**
   *
   * @returns
   */
  @Query((returns) => [Message], { name: 'members', nullable: false })
  async members() {
    return this.service.all();
  }
}
