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
import { UserService } from '../user.service';

/**
 * User Interceptor Options Class
 */
export type UserInterceptorOptions = {
  passthrough: boolean;
};

/**
 * User Interceptor Class
 */
@Injectable()
export class UserInterceptor implements NestInterceptor {
  /**
   * Default property to check
   */
  protected property: string = 'user';

  /**
   * Constructor of User Interceptor Class
   * @param {UserService} service User entity service
   * @param {UserInterceptorOptions} options Interceptor options
   */
  constructor(
    protected readonly service: UserService,
    @Optional()
    protected readonly options: UserInterceptorOptions,
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
    let _id = req.body?.user || req.params?.user;

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
     * Assign user to request object
     */
    if (!entity) throw this.service._NotFoundException();
    req.locals.user = entity;

    /**
     * Handle request
     */
    return next.handle();
  }
}
