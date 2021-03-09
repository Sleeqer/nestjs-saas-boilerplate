import { classToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { Pagination } from '../../entity/pagination';

/**
 * Transform Interceptor Class
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  /**
   * Intercept response & transform responses
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @returns {Observable<any>}
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => classToPlain(this.transform(data))));
  }

  /**
   * Transform response
   * @param {any} data Source to transform
   * @returns {Array|object}
   */
  transform(data: any): Array<any> | object {
    /**
     * Paginated response
     */
    if (data instanceof Pagination) {
      data.results = (data.results || []).map((object) =>
        object.toObject ? object.toObject() : object,
      );
      return data;
    }

    /**
     * Default response
     */
    return Array.isArray(data)
      ? data.map((object) => (object.toObject ? object.toObject() : object))
      : data.toObject
      ? data.toObject()
      : data;
  }
}
