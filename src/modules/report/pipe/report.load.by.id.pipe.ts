import { PipeTransform, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectID } from 'typeorm';

/**
 * Import local objects
 */
import { ReportService } from '../report.service';
import { FastifyRequestInterface } from '../../common/interfaces';

/**
 * Loader Pipe Class
 */
export class Loader implements PipeTransform {
  /**
   * Constructor of Loader Pipe Class
   * @param {ReportService} service Report Service
   * @param {FastifyRequestInterface} request Request
   */
  constructor(
    protected readonly service: ReportService,
    @Inject(REQUEST) private readonly request: FastifyRequestInterface,
  ) {}

  /**
   *
   * @param {any} value Evaluating
   * @returns {number | string | ObjectID} Value
   */
  async transform(value: any): Promise<string | number | ObjectID> {
    /**
     * Retrieve entity by id , if isn't undefined
     */
    const { id, report } = this.request.params as any;
    const identifier = report || id;
    if (!identifier) return value;
    let entity = undefined;

    try {
      entity = await this.service.get(identifier);
    } catch {}

    /**
     * Check if entity exists & attach to request locals
     */
    if (!entity) throw this.service._NotFoundException();
    this.request.locals.report = entity;
    return value;
  }
}
