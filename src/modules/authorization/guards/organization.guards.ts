import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * Import local objects
 */
import { GuardsPropertyObjectInterface } from './decorators';
import { OrganizationService } from '../../organization';
import { FastifyRequestInterface } from '../../common';
import { guardor } from '../../common/helpers';

/**
 * Organization Guards Class
 */
@Injectable()
export class OrganizationGuards implements CanActivate {
  /**
   * Constructor of Organization Guards Class
   * @param {Reflector} reflector Reflector
   * @param {OrganizationService} organization Organization Service
   */
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
    shield: GuardsPropertyObjectInterface,
  ): Promise<boolean> {
    const evaluation = { scope: false };
    const { profile } = request;
    const { context } = guardor(this, shield, request);

    try {
      const organization = !request.organization
        ? await this.organization.get(context)
        : request.organization;

      request.organization = organization;

      const conditions: boolean =
        organization.profile.equals(profile._id) ||
        profile.organizations.includes(organization._id);

      evaluation.scope = organization && conditions;
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

    return this.organizationer(request, property);
  }
}
