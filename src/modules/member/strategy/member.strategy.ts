import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * Import local objects
 */
import { MemberService } from '../member.service';

/**
 * Member Strategy Class
 */
@Injectable()
export class MemberStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
) {
  /**
   * Constructor of Api Key Strategy Class
   * @param {MemberService} service Member service
   */
  constructor(private readonly service: MemberService) {
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
