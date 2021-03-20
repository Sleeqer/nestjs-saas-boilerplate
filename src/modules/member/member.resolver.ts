import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { MemberService } from './member.service';
import { Member } from './member.entity';

/**
 * Member Resolver Class
 */
@Resolver(() => Member)
export class MemberResolver {
  /**
   * Constructor of Member Resolver Class
   * @param {MemberService} service Member Service
   */
  constructor(private readonly service: MemberService) {}

  /**
   *
   * @returns
   */
  @Query((returns) => [Member], { name: 'members', nullable: false })
  async members() {
    return this.service.all();
  }
}
