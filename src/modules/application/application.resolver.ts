import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { Application } from './application.entity';
import { ApplicationService } from './application.service';

/**
 * Application Resolver Class
 */
@Resolver((of) => Application)
export class ApplicationResolver {
  /**
   * Constructor of Application Resolver Class
   * @param {ApplicationService} service Application Service
   */
  constructor(private readonly service: ApplicationService) {}

  /**
   *
   * @returns
   */
  @Query((returns) => [Application], { name: 'applications', nullable: false })
  async applications() {
    return this.service.all();
  }
}
