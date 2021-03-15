import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';

/**
 * Import local objects
 */
import { ApplicationService } from '../../application/application.service';
import { FastifyRequestInterface } from '../../common/interfaces';

/**
 * Application Key Strategy Class
 */
@Injectable()
export class ApplicationKeyStrategy extends PassportStrategy(
  Strategy,
  'application.key',
) {
  /**
   * Constructor of Application Key Strategy Class
   * @param {ApplicationService} service Application service
   */
  constructor(private readonly service: ApplicationService) {
    super();
  }

  /**
   * Validate strategy
   * @param {FastifyRequestInterface} request Request
   * @param {Function} next Callback
   * @returns {Promise<boolean>}
   */
  async validate(
    request: FastifyRequestInterface,
    next: Function,
  ): Promise<any> {
    const { headers } = request;
    const key = headers['x-api-key'];

    if (!key) return next(null, false);

    const application = await this.service.by(key);
    if (!application) return next(null, false);

    /**
     * Attach application & verify token if settings exists
     */
    request.application = application;

    /**
     * Retrieve user
     */
    return next(null, true);
  }
}
