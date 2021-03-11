import { Query, Resolver } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { Report } from './report.entity';
import { ReportService } from './report.service';

/**
 * Report Resolver Class
 */
@Resolver((of) => Report)
export class ReportResolver {
  /**
   * Constructor of Report Resolver Class
   * @param {ReportService} service Report Service
   */
  constructor(private readonly service: ReportService) {}

  /**
   *
   * @returns
   */
  @Query((returns) => [Report], { name: 'reports', nullable: false })
  async reports() {
    return this.service.all();
  }
}
