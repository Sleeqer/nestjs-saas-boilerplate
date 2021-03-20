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
import { FastifyRequestInterface } from '../../common/interfaces';
import { ApplicationSettings } from '../../application';
import { UserService } from '../../user/user.service';
import { alive } from '../../common/helpers';
import { ConfigService } from '../../config';

/**
 * Tokenize Result
 */
type TokenizeResult = {
  scope: boolean;
  user: any;
};

/**
 * User Guards Class
 */
@Injectable()
export class UserGuards implements CanActivate {
  /**
   * JWT Service Instance
   * @type {JwtService}
   */
  protected readonly jwt: JwtService;

  /**
   * Field to query User Service
   * @type {string}
   */
  private keyed: string = 'sso';

  /**
   * Constructor of User Guards Class
   * @param {UserService} user User Service
   * @param {ConfigService} config Config Service
   */
  constructor(
    private readonly user: UserService,
    private readonly config: ConfigService,
  ) {
    const secret: string = config.get('WEBTOKEN_SECRET_KEY');
    const expire: string = config.get('WEBTOKEN_EXPIRATION_TIME');

    /**
     * Instantiate
     */
    this.jwt = new JwtService({
      secret,
      signOptions: {
        ...(expire
          ? {
              expiresIn: Number(expire),
            }
          : {}),
      },
    });
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
    const evaluation: TokenizeResult = {
      scope: true,
      user: null,
    };
    const { secret, property } = settings.token;

    /**
     * One of fields from settings are empty , so skip this token validation
     */
    if (!secret && !property) return evaluation;

    /**
     * Validate token
     */
    try {
      const decoded = alive(this.jwt.verify(token, { secret }));
      const field = decoded[property] || '_id';
      const user = await this.user.by(field, this.keyed);
      evaluation.user = user;
      if (!user) evaluation.scope = false;
    } catch {
      evaluation.scope = false;
    }

    /**
     * Defaulting response
     */
    return evaluation;
  }

  /**
   * Retrieve user & validates token
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>} Scope
   */
  async userer(request: FastifyRequestInterface): Promise<boolean> {
    const evaluation = { scope: false };
    const { headers, application } = request;
    const authorization: string = headers['authorization'] as string;
    const token = authorization?.replace('Bearer', '')?.trim() || '';

    try {
      const { user, scope } = !request.user
        ? await this.tokenization(application.settings, token)
        : { user: request.user, scope: true };

      request.user = user;
      evaluation.scope =
        user && scope && application._id.equals(user.application)
          ? true
          : false;
    } catch {
      evaluation.scope = false;
    }

    if (!evaluation.scope) throw new UnauthorizedException();
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

    return this.userer(request);
  }
}
