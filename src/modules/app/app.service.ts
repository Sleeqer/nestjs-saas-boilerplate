import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';

/**
 * Import local objects
 */
import { ConfigService } from '../config/config.service';

/**
 * App Service Class
 */
@Injectable()
export class AppService {
  /**
   * Log headline
   * @type {string}
   */
  private readonly log: string = `[Application]`;

  /**
   * Constructor of App Service Class
   * @param {ConfigService} config Config Service
   * @param {Logger} logger Logger Service
   */
  constructor(
    private readonly config: ConfigService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /**
   * Retrieve Application Url
   * @returns {string} Application Url
   */
  index(): string {
    const url: string = this.config.get('APPLICATION_URL');

    this.logger.info(`${this.log} -> ${url}`);
    return url;
  }
}
