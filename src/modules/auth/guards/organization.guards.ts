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
  ) { }

  /**
   * Retrieve profile & validates token
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>} Scope
   */
  async organizationer(
    request: FastifyRequestInterface,
    shield: GuardsPropertyObjectInterface,
  ): Promise<boolean> {
    const current = this instanceof (shield?.guards as Function);
    const evaluation = { scope: false };
    const { profile } = request;
    const location: string = ((current) ? shield?.location : 'params') || 'params'
    const field: string = ((current) ? shield?.property : 'id') || 'id'
    const params: any = request[location]

    try {
      const organization = !request.organization
        ? await this.organization.get(params[field])
        : request.organization;

      request.organization = organization;
      const condition = organization.profile.equals(profile._id) || profile.organizations.includes(organization._id)
      evaluation.scope = organization && condition
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
    )

    const request: FastifyRequestInterface = context
      .switchToHttp()
      .getRequest();

    return this.organizationer(request, property);
  }
}
