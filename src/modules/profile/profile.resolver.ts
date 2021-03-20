import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { ProfileService } from './profile.service';
import { Profile } from './profile.entity';

/**
 * Profile Resolver Class
 */
@Resolver(() => Profile)
export class ProfileResolver {
  /**
   * Constructor of Profile Resolver Class
   * @param {ProfileService} service Profile Service
   */
  constructor(private readonly service: ProfileService) {}

  /**
   * Retrieve members
   * @returns
   */
  @Query((returns) => [Profile], { name: 'members', nullable: false })
  async members() {
    return this.service.all();
  }
}
