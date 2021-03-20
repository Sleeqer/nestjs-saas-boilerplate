import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { ApplicationService } from '../../application/application.service';
import { ApplicationSettings } from '../../application';
import { FastifyRequestInterface } from '../../common';
import { UserService } from '../../user/user.service';

/**
 * Tokenize Result
 */
type TokenizeResult = {
  /**
   * Evaluated result
   * @type {boolean}
   */
  evaluated: boolean;

  /**
   * User entity
   * @type {any}
   */
  user: any;
};

/**
 * Application Guard Class
 */
@Injectable()
export class ApplicationGuard implements CanActivate {
  /**
   * JWT Service
   * @type {JwtService}
   */
  private readonly jwt: JwtService;

  /**
   * Field to query User Service
   * @type {string}
   */
  private keyed: string = 'sso';

  /**
   * Constructor of Application Strategy Class
   * @param {ApplicationService} service Application service
   * @param {UserService} user User Service
   */
  constructor(
    private readonly service: ApplicationService,
    private readonly user: UserService,
  ) {
    this.jwt = new JwtService({});
  }

  /**
   * Validate token of by application settings
   * @param {ApplicationSettings} settings Application Settings
   * @param {string} token Token to verify
   * @returns {Promise<TokenizeResult>} Tokenize Result
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
   * Validate application
   * @param {string} _id Application's _id
   * @param {string} token Token to check
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>} Scope
   */
  async application(
    _id: string,
    token: string,
    request: FastifyRequestInterface,
  ): Promise<boolean> {
    let application = undefined;
    try {
      application = await this.service.by(_id, '_id');
    } catch {}

    /**
     * Applicatino does not exists , reject
     */
    if (!application) throw new UnauthorizedException();

    /**
     * Defaulting response
     */
    request.application = application;
    const tokenize = await this.tokenization(application.settings, token);

    request.user =
      tokenize.evaluated && tokenize.user
        ? tokenize.user
        : request.user || undefined;

    const evaluation = tokenize.evaluated;
    if (!evaluation) throw new UnauthorizedException();
    return evaluation;
  }

  /**
   * Validate permissions
   * @param {ExecutionContext} context Context
   * @returns
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: FastifyRequestInterface = context
      .switchToHttp()
      .getRequest();

    /**
     * Access headers
     */
    const { headers } = request;

    /**
     * Retrieve application identifier & token
     */
    const key = headers['x-api-key'];
    const authorization = headers['authorization']?.replace('Bearer', '');
    if (!key) throw new UnauthorizedException();

    return this.application(
      key as string,
      (authorization?.trim() || '') as string,
      request,
    );
  }
}
