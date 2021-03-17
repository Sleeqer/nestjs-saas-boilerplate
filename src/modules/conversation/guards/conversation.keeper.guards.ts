import { Observable } from 'rxjs';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Import local objects
 */
import { FastifyRequestInterface } from '../../common/interfaces';

/**
 * Conversation Keeper Guards Class
 */
@Injectable()
export class ConversationKeeperGuards implements CanActivate {
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
