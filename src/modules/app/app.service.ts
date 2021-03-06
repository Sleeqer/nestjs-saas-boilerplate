import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Logger } from 'winston';

/**
 * Application Service
 */
@Injectable()
export class AppService {
  /**
   * Constructor
   * @param {ConfigService} config configuration service
   * @param {Logger} logger logging service
   */
  constructor(
    private readonly config: ConfigService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Fetches and logs the APPLICATION_URL environment variable from a configuration file.
   * @returns {string} the application url
   */
  root(): string {
    const url = this.config.get('APPLICATION_URL');
    this.logger.info('Logging the APPLICATION_URL -> ' + url);
    return url;
  }
}
