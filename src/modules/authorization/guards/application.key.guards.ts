import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * Import local objects
 */
import { ApplicationService } from '../../application/application.service';
import { FastifyRequestInterface } from '../../common/interfaces';
import { GuardsPropertyObjectInterface } from './decorators';
import { guardor } from '../../common/helpers';

/**
 * Application Key Guards Class
 */
@Injectable()
export class ApplicationKeyGuards implements CanActivate {
  /**
   * Constructor of Application Key Guards Class
   * @param {Reflector} reflector Reflector
   * @param {ApplicationService} application Application
   */
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
    const evaluation = { scope: false };
    const key: string = request.headers['x-api-key'] as string;
    const { context } = guardor(this, shield, request);

    try {
      const application = !request.application
        ? await this.application.get(key || context)
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
