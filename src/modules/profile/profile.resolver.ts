import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

/**
 * Profile Resolver Class
 */
@Resolver((of) => Profile)
export class ProfileResolver {
  /**
   * Constructor of Profile Resolver Class
   * @param {ProfileService} service Profile Service
   */
  constructor(private readonly service: ProfileService) {}

  /**
   *
   * @returns
   */
  @Query((returns) => [Profile], { name: 'members', nullable: false })
  async members() {
    return this.service.all();
  }
}
