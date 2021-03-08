import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { Organization } from './organization.entity';
import { OrganizationService } from './organization.service';

/**
 * Organization Resolver Class
 */
@Resolver((of) => Organization)
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
  @Query((returns) => [Organization], { name: 'entities', nullable: false })
  async entities() {
    return this.service.all();
  }
}
