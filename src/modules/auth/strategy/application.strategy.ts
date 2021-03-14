import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { JwtService } from '@nestjs/jwt';

/**
 * Import local objects
 */
import { ApplicationService } from '../../application/application.service';
import { ApplicationSettings } from '../..//application/application.entity';
import { FastifyRequestInterface } from '../../common/interfaces';
import { UserService } from '../../user/user.service';

/**
 * Tokenize Result
 */
type TokenizeResult = {
  evaluated: boolean;
  user: any;
};

/**
 * Application Strategy Class
 */
@Injectable()
export class ApplicationStrategy extends PassportStrategy(
  Strategy,
  'application',
) {
  /**
   * Field to query User Service
   * @type {string}
   */
  private keyed: string = 'sso';

  /**
   * Constructor of Application Strategy Class
   * @param {ApplicationService} service Application service
   * @param {JwtService} jwt JWT Service
   * @param {UserService} user User Service
   */
  constructor(
    private readonly service: ApplicationService,
    private readonly jwt: JwtService,
    private readonly user: UserService,
  ) {
    super();
  }

  /**
   * Validate token of by application settings
   * @param {ApplicationSettings} settings Application Settings
   * @param {string} token Token to verify
   * @returns {Promise<TokenizeResult>}
   */
  async tokenization(
    settings: ApplicationSettings,
    token: string,
  ): Promise<TokenizeResult> {
    const defaults = {
      evaluated: true,
      user: null,
    };
    const { secret, property } = settings.token;

    /**
     * One of fields from settings are empty , so skip this token validation
     */
    if (!secret || !property) return defaults;

    /**
     * Validate token
     */
    try {
      const decoded = this.jwt.verify(token, { secret });
      const field = decoded[property];
      const user = await this.user.by(field, this.keyed);
      defaults.user = user;
      if (!user) defaults.evaluated = false;
    } catch {
      defaults.evaluated = false;
    }

    /**
     * Defaulting response
     */
    return defaults;
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
    const authorization =
      headers['authorization']?.replace('Bearer', '')?.trim() || '';

    if (!key) return next(null, false);

    const application = await this.service.by(key, '_id');
    if (!application) return next(null, false);

    /**
     * Attach application & verify token if settings exists
     */
    request.locals.application = application;
    const tokenize = await this.tokenization(
      application.settings,
      authorization,
    );

    /**
     * Retrieve user
     */
    const user =
      tokenize.evaluated && tokenize.user ? tokenize.user : request.user;
    return next(null, user);
  }
}
