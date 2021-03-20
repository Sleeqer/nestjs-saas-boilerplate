import { PipeTransform, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectID } from 'typeorm';

/**
 * Import local objects
 */
import { MessageService } from '../../message';
import { FastifyRequestInterface } from '../../common/interfaces';

/**
 * Loader Class
 */
export class Loader implements PipeTransform {
  /**
   * Constructor of Loader Class
   * @param {MessageService} service Member Service
   * @param {FastifyRequestInterface} request Request
   */
  constructor(
    protected readonly service: MessageService,
    @Inject(REQUEST) private readonly request: FastifyRequestInterface,
  ) {}

  /**
   * Transformer
   * @param {any} value Evaluating
   * @returns {number | string | ObjectID} Value
   */
  async transform(value: any): Promise<string | number | ObjectID> {
    /**
     * Retrieve entity by id , if isn't undefined
     */
    const { id } = this.request.params as any;
    if (!id) return value;
    let entity = undefined;

    try {
      entity = await this.service.get(id);
    } catch {}

    /**
     * Check if entity exists & attach to request locals
     */
    if (!entity) throw this.service._NotFoundException();
    this.request.locals.message = entity;
    return value;
  }
}
