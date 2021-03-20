import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

/**
 * Import local objects
 */
import { ProfileService } from '../profile/profile.service';
import { ConfigService } from '../config';

/**
 * Jwt Strategy Class
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor of Jwt Strategy Class
   * @param {ConfigService} config Config Service
   * @param {ProfileService} profile Profile Service
   */
  constructor(
    protected readonly config: ConfigService,
    private readonly profile: ProfileService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('WEBTOKEN_SECRET_KEY'),
    });
  }

  /**
   * Checks if the bearer token is a valid token
   * @param {any} jwtPayload validation method for jwt token
   * @param {any} done callback to resolve the request user with
   * @returns {Promise<object>} a object to be signed
   */
  async validate({ iat, exp, _id }: any, done: any): Promise<object> {
    if (exp - iat <= 0) throw new UnauthorizedException();

    const profile = await this.profile.get(_id);
    if (!profile) throw new UnauthorizedException();

    delete profile.password;
    done(null, profile);
    return { ...profile };
  }
}
