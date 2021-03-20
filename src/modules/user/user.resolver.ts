import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { UserService } from './user.service';
import { User } from './user.entity';

/**
 * User Resolver Class
 */
@Resolver(() => User)
export class UserResolver {
  /**
   * Constructor of User Resolver Class
   * @param {UserService} service User Service
   */
  constructor(private readonly service: UserService) {}

  /**
   *
   * @returns
   */
  @Query((returns) => [User], { name: 'users', nullable: false })
  async users() {
    return this.service.all();
  }
}
