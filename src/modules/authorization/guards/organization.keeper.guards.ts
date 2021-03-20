import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Import local objects
 */
import { FastifyRequestInterface } from '../../common';

/**
 * Organization Keeper Guards Class
 */
@Injectable()
export class OrganizationKeeperGuards implements CanActivate {
  /**
   * Validates keeper of organization
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>} Scope
   */
  async organizationer(request: FastifyRequestInterface): Promise<boolean> {
    const evaluation = { scope: false };
    const { profile, organization } = request;

    try {
      evaluation.scope = organization.profile.equals(profile._id);
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
    const request: FastifyRequestInterface = context
      .switchToHttp()
      .getRequest();

    return this.organizationer(request);
  }
}
