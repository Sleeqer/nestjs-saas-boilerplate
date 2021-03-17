import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * Import local objects
 */
import { ProfileService } from '../profile.service';

/**
 * Profile Strategy Class
 */
@Injectable()
export class ProfileStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
) {
  /**
   * Constructor of Api Key Strategy Class
   * @param {ProfileService} service Profile service
   */
  constructor(private readonly service: ProfileService) {
    super(
      { header: 'X-API-Key', prefix: '' },
      true,
      async (key: string, done: Function) => {
        const data = await service.by(key);
        return data ? done(true) : done(false);
      },
    );
  }
}
