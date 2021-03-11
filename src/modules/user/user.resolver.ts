import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { User } from './user.entity';
import { UserService } from './user.service';

/**
 * User Resolver Class
 */
@Resolver((of) => User)
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
