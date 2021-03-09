import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';

/**
 * Import local objects
 */
import { FastifyRequestInterface } from '../../common/interfaces';
import { ApplicationService } from '../../application/application.service';

/**
 * Application Strategy Class
 */
@Injectable()
export class ApplicationStrategy extends PassportStrategy(
  Strategy,
  'application',
) {
  /**
   * Constructor of Application Strategy Class
   * @param {ApplicationService} service Application service
   */
  constructor(private readonly service: ApplicationService) {
    super();
  }

  /**
   * Validate strategy
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>}
   */
  async validate(request: FastifyRequestInterface): Promise<boolean> {
    const { headers } = request;
    const key = headers['x-api-key'];

    if (!key) return false;

    const application = await this.service.by(key);
    if (!application) return false;

    request.locals.application = application;
    return true;
  }
}
