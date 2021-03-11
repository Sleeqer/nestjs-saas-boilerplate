import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * Import local objects
 */
import { ApplicationService } from '../application.service';

/**
 * Application Strategy Class
 */
@Injectable()
export class ApplicationStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
) {
  /**
   * Constructor of Api Key Strategy Class
   * @param {ApplicationService} service Application service
   */
  constructor(private readonly service: ApplicationService) {
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
