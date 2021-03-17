import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import * as crypto from 'crypto';
import * as relative from 'dayjs/plugin/relativeTime';

dayjs.extend(relative);

/**
 * Import local objects
 */
import { LoginPayload } from './payload/login.payload';
import { ConfigService } from '../config/config.service';
import { ProfileService, Profile } from '../profile';

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
  expires_pretty_print?: string;
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
   * @param {JwtService} jwt jwt service
   * @param {ConfigService} configService configuration service
   * @param {ProfileService} profile profile service
   */
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly profile: ProfileService,
  ) {
    this.expiration = this.configService.get('WEBTOKEN_EXPIRATION_TIME');
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
   * @returns {Promise<Profile>} Registered Profile
   */
  async validate({ email, password }: LoginPayload): Promise<Profile> {
    const profile = await this.profile.find({
      email,
      password: crypto.createHmac('sha256', password).digest('hex'),
    });

    if (!profile) throw this.profile._UnauthorizedException();
    return profile;
  }

  /**
   * Creates a signed jwt token based on Profile payload
   * @param {Profile} param dto to generate token from
   * @returns {Promise<ITokenReturnBody>} token body
   */
  async tokenize({
    _id,
    name,
    email,
    first_name,
    last_name,
  }: Profile): Promise<ITokenReturnBody> {
    return {
      expires: this.expiration,
      expires_pretty_print: AuthService.prettyPrintSeconds(this.expiration),
      token: this.jwt.sign({
        _id,
        first_name,
        last_name,
        name,
        email,
      }),
    };
  }
}
