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
import { ConfigService } from '../../config/config.service';
import { ProfileService } from '../../profile/profile.service';
import { FastifyRequestInterface } from '../../common/interfaces';

/**
 * Profile Guards Class
 */
@Injectable()
export class ProfileGuards implements CanActivate {
  /**
   * JWT Service Instance
   * @type {JwtService}
   */
  protected readonly jwt: JwtService;

  /**
   * Constructor of Profile Guards Class
   * @param {ProfileService} profile Profile Service
   * @param {ConfigService} config Config Service
   */
  constructor(
    protected readonly profile: ProfileService,
    protected readonly config: ConfigService,
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
   *
   * @param {any} decoded Decoded token
   * @returns {any} Initial decoded value
   */
  alive(decoded: any): any {
    const now = Date.now().valueOf() / 1000;

    if (decoded?.exp && decoded.exp < now) throw new Error();
    if (decoded?.nbf && decoded.nbf > now) throw new Error();

    return decoded;
  }

  /**
   * Retrieve profile & validates token
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>} Scope
   */
  async memberer(request: FastifyRequestInterface): Promise<boolean> {
    const evaluation = { scope: false };
    const { headers } = request;
    const authorization: string = headers['authorization'] as string;
    const token = authorization?.replace('Bearer', '')?.trim() || '';

    try {
      const decoded = this.alive(this.jwt.decode(token));
      const profile = !request.profile
        ? await this.profile.get(decoded?._id)
        : request.profile;

      request.profile = profile;
      evaluation.scope = profile ? true : false;
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

    return this.memberer(request);
  }
}
