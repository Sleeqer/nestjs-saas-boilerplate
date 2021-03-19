import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * Import local objects
 */
import { MessageService } from '../message.service';

/**
 * Message Strategy Class
 */
@Injectable()
export class MessageStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
) {
  /**
   * Constructor of Api Key Strategy Class
   * @param {MessageService} service Message service
   */
  constructor(private readonly service: MessageService) {
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
