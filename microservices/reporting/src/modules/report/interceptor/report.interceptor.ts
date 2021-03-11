import { Observable } from 'rxjs';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

/**
 * Import local level objects
 */
import { ReportService } from '../report.service';

/**
 * Report Interceptor Class
 */
@Injectable()
export class ReportInterceptor implements NestInterceptor {
  /**
   * Constructor of Report Interceptor Class
   * @param {ReportService} service Report entity service
   */
  constructor(protected readonly service: ReportService) {}

  /**
   * Intercept requests
   * @param {ExecutionContext} context Context
   * @param {CallHandler} next Call handler
   * @returns {Observable<any>} Observable
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const [req] = context.getArgs();
    const organization = await this.service.get(req?.params?.organization);

    /**
     * Assign organization to request object
     */
    if (!organization) throw this.service._NotFoundException();
    req.locals.organization = organization;

    /**
     * Handle request
     */
    return next.handle();
  }
}
