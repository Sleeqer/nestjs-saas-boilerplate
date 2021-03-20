import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { OrganizationService } from './organization.service';
import { Organization } from './organization.entity';

/**
 * Organization Resolver Class
 */
@Resolver(() => Organization)
export class OrganizationResolver {
  /**
   * Constructor of Organization Resolver Class
   * @param {OrganizationService} service Organization Service
   */
  constructor(private readonly service: OrganizationService) {}

  /**
   *
   * @returns
   */
  @Query((returns) => [Organization], {
    name: 'organizations',
    nullable: false,
  })
  async organizations() {
    return this.service.all();
  }
}
