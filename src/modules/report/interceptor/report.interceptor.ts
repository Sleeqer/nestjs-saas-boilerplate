import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Optional,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

/**
 * Import local level objects
 */
import { ReportService } from '../report.service';

/**
 * Report Interceptor Options Class
 */
export type ReportInterceptorOptions = {
  passthrough: boolean;
};

/**
 * Report Interceptor Class
 */
@Injectable()
export class ReportInterceptor implements NestInterceptor {
  /**
   * Default property to check
   */
  protected property: string = 'report';

  /**
   * Constructor of Report Interceptor Class
   * @param {ReportService} service Report entity service
   * @param {ReportInterceptorOptions} options Interceptor options
   */
  constructor(
    protected readonly service: ReportService,
    @Optional()
    protected readonly options: ReportInterceptorOptions,
  ) {
    this.options = options || { passthrough: true };
  }

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
    let _id = req.body?.report || req.params?.report;

    /**
     * Indicates , that if _id is not present just keep going on with the request
     */
    if (!_id && this.options.passthrough) return next.handle();

    /**
     * Validate _id
     */
    try {
      _id = new ObjectId(_id);
    } catch (error) {
      throw new BadRequestException({
        property: this.property,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
        error: HttpStatus[HttpStatus.BAD_REQUEST],
      });
    }

    /**
     * Query entity
     */
    const entity = await this.service.get(_id);

    /**
     * Assign report to request object
     */
    if (!entity) throw this.service._NotFoundException();
    req.locals.report = entity;

    /**
     * Handle request
     */
    return next.handle();
  }
}
