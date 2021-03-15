import { Observable } from 'rxjs';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Import local objects
 */
import { FastifyRequestInterface } from '../../common/interfaces';
import { ApplicationService } from '../../application/application.service';

/**
 * Application Guards Class
 */
@Injectable()
export class ApplicationMasterKeyGuards implements CanActivate {
  constructor(private readonly application: ApplicationService) {}

  /**
   * Retrieve application & validates token
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>} Scope
   */
  async applicationer(request: FastifyRequestInterface): Promise<boolean> {
    const evaluation = { scope: false };
    const { headers } = request;
    const key: string = headers['x-api-key'] as string;

    try {
      const application = !request.application
        ? await this.application.by(key, 'key')
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
    const request: FastifyRequestInterface = context
      .switchToHttp()
      .getRequest();

    return this.applicationer(request);
  }
}
