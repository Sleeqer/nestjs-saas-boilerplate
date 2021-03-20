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
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { ConfigService } from '../../config';

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
  protected children: Array<any> = [];

  /**
   * Constructor of Format Response Exception Class
   * @param {string} message Message
   * @param {string} property Property of message
   * @param {object} details Details
   * @param {object} children Details
   */
  constructor(
    message: string = '',
    property: string = '',
    details: object = {},
    children: Array<any> = [],
  ) {
    this.property = property;
    this.message = message;
    this.details = details;
    this.children = children;
  }
}

/**
 * Format Response Exception Messages Class
 */
export class FormatResponseExceptionMessages {
  /**
   * Default object
   */
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
   * @param {any} data Message to apply formatting
   */
  constructor(data: any) {
    /**
     * Formatting data
     */
    const errors = [];
    if (Array.isArray(data.message)) {
      this.object.error.errors = this.format(data.message, errors);

      /**
       * General message , human readable
       */
      this.object.error.message = data.error;
    }

    if (!Array.isArray(data.message)) {
      this.object.error.errors.push(
        new FormatResponseException(data.message, data?.property || ''),
      );

      /**
       * General message , human readable , this time main error
       */
      this.object.error.message = data.message;
    }

    this.object.error.status = ChangeCase.constantCase(
      data?.error || data?.message || '',
    );
    this.object.error.code = data.status || data.statusCode;
  }

  /**
   * Format array of messages
   * @param {any} data
   * @param {Array<FormatResponseException>} data
   */
  private format(messages: any, errors: Array<FormatResponseException> = []) {
    /**
     * Array of messages , parse each message and format
     */
    messages.forEach((message: ValidationError) => {
      const details = {};
      const constraints = Object.keys(message?.constraints || {}) || [];
      constraints.forEach((constraint) => {
        details[ChangeCase.constantCase(constraint || '')] =
          message?.constraints[constraint];
      });

      /**
       * Add to errors object
       */
      const children =
        (message?.children &&
          Array.isArray(message.children) &&
          this.format(message.children)) ||
        [];
      errors.push(
        new FormatResponseException(
          details[Object.keys(details)?.find((key) => key)] || '',
          message?.property || '',
          details,
          children,
        ),
      );
    });

    return errors;
  }

  /**
   *
   * @returns {object}
   */
  public getObject() {
    return this.object;
  }
}

/**
 * Http Exception Filter Class
 */
@Catch()
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
   * @param {unknown | HttpException} exception
   * @param {ArgumentsHost} host
   * @returns {FastifyReply}
   */
  catch(exception: unknown | HttpException, host: ArgumentsHost): FastifyReply {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const internal = !(exception instanceof HttpException)
      ? new InternalServerErrorException()
      : undefined;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : internal.getStatus();

    const data: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : internal.getResponse();

    /**
     * Formatted response exception
     */
    const object: any = {
      ...new FormatResponseExceptionMessages(data).getObject(),
      timestamp: new Date().toISOString(),
    };

    /**
     * Add stack for development
     */
    if (config.env('dev')) object.stack = (exception as any)?.stack || '';

    /**
     * Log errors , only if required by environment
     */
    if ((config.get('LOGGER_HTTP') as unknown) as boolean)
      this.logger.error(
        `${this.log} -> Error ${object.error.code} on ${
          request?.ip || '0.0.0.0'
        } (${JSON.stringify(object)})`,
        (exception as any)?.stack || '',
      );

    /**
     * Response of error to client side
     */
    return response.status(status).send(object);
  }
}
