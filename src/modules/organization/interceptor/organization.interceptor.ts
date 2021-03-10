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
import { OrganizationService } from '../organization.service';

/**
 * Organization Interceptor Class
 */
@Injectable()
export class OrganizationInterceptor implements NestInterceptor {
  /**
   * Constructor of Organization Interceptor Class
   * @param {OrganizationService} service Organization entity service
   */
  constructor(protected readonly service: OrganizationService) {}

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
