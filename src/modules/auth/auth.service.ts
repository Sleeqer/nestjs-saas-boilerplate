import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import * as relative from 'dayjs/plugin/relativeTime';

dayjs.extend(relative);

/**
 * Import local objects
 */
import { Profile } from '../profile/profile.entity';
import { LoginPayload } from './payload/login.payload';
import { ConfigService } from '../config/config.service';
import { ProfileService } from '../profile/profile.service';

/**
 * Models a typical Login/Register route return body
 */
export interface ITokenReturnBody {
  /**
   * When the token is to expire in seconds
   */
  expires: string;
  /**
   * A human-readable format of expires
   */
  expiresPrettyPrint: string;
  /**
   * The Bearer token
   */
  token: string;
}

/**
 * Authentication Service
 */
@Injectable()
export class AuthService {
  /**
   * Time in seconds when the token is to expire
   * @type {string}
   */
  private readonly expiration: string;

  /**
   * Constructor
   * @param {JwtService} jwtService jwt service
   * @param {ConfigService} configService configuration service
   * @param {ProfileService} profileService profile service
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly profileService: ProfileService,
  ) {
    this.expiration = this.configService.get('WEBTOKEN_EXPIRATION_TIME');
  }

  /**
   * Creates a signed jwt token based on Profile payload
   * @param {Profile} param dto to generate token from
   * @returns {Promise<ITokenReturnBody>} token body
   */
  async createToken({
    _id,
    username,
    name,
    email,
  }: Profile): Promise<ITokenReturnBody> {
    return {
      expires: this.expiration,
      expiresPrettyPrint: AuthService.prettyPrintSeconds(this.expiration),
      token: this.jwtService.sign({
        _id,
        username,
        name,
        email,
      }),
    };
  }

  /**
   * Formats the time in seconds into human-readable format
   * @param {string} time
   * @returns {string} hrf time
   */
  private static prettyPrintSeconds(time: string): string {
    const future = dayjs().add(Number(time), 'seconds');
    return future.fromNow(true);
  }

  /**
   * Validates whether or not the profile exists in the database
   * @param {LoginPayload} param login payload to authenticate with
   * @returns {Promise<Profile>} registered profile
   */
  async validateUser({ username, password }: LoginPayload): Promise<Profile> {
    const user = await this.profileService.getByUsernameAndPass(
      username,
      password,
    );

    if (!user)
      throw new UnauthorizedException(
        'Could not authenticate. Please try again',
      );

    return user;
  }
}
