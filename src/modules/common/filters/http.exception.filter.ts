import { FastifyReply, FastifyRequest } from 'fastify';
import * as ChangeCase from 'change-case';
import { Logger } from 'winston';
import {
  ValidationError,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { ConfigService } from '../../config/config.service';

/**
 * Current config
 * @type {ConfigService}
 */
const config: ConfigService = ConfigService.getInstance();

/**
 * Format Response Exception Class
 */
export class FormatResponseException {
  protected property: string = '';
  protected message: string = '';
  protected details: object = {};

  /**
   * Constructor of Format Response Exception Class
   * @param {string} message Message
   * @param {string} property Property of message
   * @param {object} details Details
   */
  constructor(
    message: string = '',
    property: string = '',
    details: object = {},
  ) {
    this.property = property;
    this.message = message;
    this.details = details;
  }
}

/**
 * Format Response Exception Messages Class
 */
export class FormatResponseExceptionMessages {
  private object = {
    error: {
      code: 400,
      message: 'Bad Request',
      errors: [],
      status: 'BAD_REQUEST',
    },
  };

  /**
   * Constructor of Format Response Exception Message Class
   * @param {Array<ValidationError> | string} messages Message to apply formatting
   */
  constructor(data: any) {
    if (Array.isArray(data.message)) {
      /**
       * Array of messages , parse each message and format
       */
      data.message.forEach((message: ValidationError) => {
        const details = {};
        const constraints = Object.keys(message?.constraints) || [];
        constraints.forEach((constraint) => {
          details[ChangeCase.constantCase(constraint)] =
            message?.constraints[constraint];
        });

        /**
         * Add to errors object
         */
        this.object.error.errors.push(
          new FormatResponseException(
            details[Object.keys(details)?.find((key) => key)] || '',
            message?.property || '',
            details,
          ),
        );
      });

      /**
       * General message , human readable
       */
      this.object.error.message = data.error;
    }

    if (!Array.isArray(data.message)) {
      this.object.error.errors.push(new FormatResponseException(data.message));

      /**
       * General message , human readable , this time main error
       */
      this.object.error.message = data.message;
    }

    this.object.error.status = ChangeCase.constantCase(data.error);
    this.object.error.code = data.statusCode;
  }

  public getObject() {
    return this.object;
  }
}

/**
 * Http Exception Filter Class
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Log headline
   * @type {string}
   */
  private readonly log: string = `[HTTP]`;

  /**
   * Constructor of Http Exception Filter
   * @param {Logger} logger Logger
   */
  constructor(@Inject('winston') private readonly logger: Logger) {}

  /**
   * Catch incomming http exception
   * @param {HttpException} exception
   * @param {ArgumentsHost} host
   * @returns {FastifyReply}
   */
  catch(exception: HttpException, host: ArgumentsHost): FastifyReply {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();
    const data: any = exception.getResponse();

    /**
     * Formatted response exception
     */
    const object: any = {
      ...new FormatResponseExceptionMessages(data).getObject(),
      timestamp: new Date().toISOString(),
    };

    /**
     * Log errors , only if required by environment
     */
    if ((config.get('LOGGER_HTTP') as unknown) as boolean)
      this.logger.error(
        `${this.log} -> Error ${object.error.code} on ${
          request.ip
        } (${JSON.stringify(object)})`,
      );

    /**
     * Response of error to client side
     */
    return response.status(status).send(object);
  }
}
