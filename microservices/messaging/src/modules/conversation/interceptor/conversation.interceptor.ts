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
import { ConversationService } from '../conversation.service';

/**
 * Conversation Interceptor Options Class
 */
export type ConversationInterceptorOptions = {
  passthrough: boolean;
};

/**
 * Conversation Interceptor Class
 */
@Injectable()
export class ConversationInterceptor implements NestInterceptor {
  /**
   * Default property to check
   */
  protected property: string = 'conversation';

  /**
   * Constructor of Conversation Interceptor Class
   * @param {ConversationService} service Conversation entity service
   * @param {ConversationInterceptorOptions} options Interceptor options
   */
  constructor(
    protected readonly service: ConversationService,
    @Optional()
    protected readonly options: ConversationInterceptorOptions,
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
    let _id = req.body?.conversation || req.params?.conversation;

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
     * Assign conversation to request object
     */
    if (!entity) throw this.service._NotFoundException();
    req.locals.conversation = entity;

    /**
     * Handle request
     */
    return next.handle();
  }
}
