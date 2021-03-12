import { Observable } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Import local objects
 */
import { FastifyRequestInterface } from '../../common/interfaces';
import { OrganizationService } from '../../organization/organization.service';
import { GuardsPropertyObjectInterface } from './decorators';

/**
 * Organization Guards Class
 */
@Injectable()
export class OrganizationGuards implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly organization: OrganizationService,
  ) {}

  /**
   * Retrieve profile & validates token
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>} Scope
   */
  async organizationer(
    request: FastifyRequestInterface,
    property: GuardsPropertyObjectInterface,
  ): Promise<boolean> {
    const current = this instanceof (property.guards as Function);
    const evaluation = { scope: false };
    const { profile, params } = request;

    console.log(profile, params);

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

    return this.organizationer(request, property);
  }
}
