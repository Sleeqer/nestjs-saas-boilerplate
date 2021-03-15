import { Observable } from 'rxjs';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Import local objects
 */
import { FastifyRequestInterface } from '../../common/interfaces';
import { ApplicationService } from '../../application/application.service';
import { GuardsPropertyObjectInterface } from './decorators';

/**
 * Application Guards Class
 */
@Injectable()
export class ApplicationKeyGuards implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly application: ApplicationService,
  ) {}

  /**
   * Retrieve application & validates token
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>} Scope
   */
  async applicationer(
    request: FastifyRequestInterface,
    shield: GuardsPropertyObjectInterface,
  ): Promise<boolean> {
    const current = shield?.guards
      ? this instanceof (shield?.guards as Function)
      : undefined;
    const evaluation = { scope: false };
    const { headers } = request;
    const key: string = headers['x-api-key'] as string;
    const location: string =
      (current ? shield?.location : 'params') || 'params';
    const field: string = (current ? shield?.property : 'id') || 'id';
    const params: any = request[location];

    try {
      const application = !request.application
        ? await this.application.get(key || params[field])
        : request.application;

      request.application = application;
      evaluation.scope = application ? true : false;
    } catch {
      evaluation.scope = false;
    }

    return evaluation.scope;
  }

  /**
   * Check whenever guard succeeds
   * @param {ExecutionContext} context
   * @returns {boolean | Promise<boolean> | Observable<boolean>}
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const property: GuardsPropertyObjectInterface = this.reflector.get(
      'guards.property',
      context.getHandler(),
    );

    const request: FastifyRequestInterface = context
      .switchToHttp()
      .getRequest();

    return this.applicationer(request, property);
  }
}
