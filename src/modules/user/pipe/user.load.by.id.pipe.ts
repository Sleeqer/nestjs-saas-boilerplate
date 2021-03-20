import { PipeTransform, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Types } from 'mongoose';

/**
 * Import local objects
 */
import { FastifyRequestInterface } from '../../common';
import { UserService } from '../user.service';

/**
 * Loader Class
 */
export class Loader implements PipeTransform {
  /**
   * Constructor of Loader Class
   * @param {UserService} service User Service
   * @param {FastifyRequestInterface} request Request
   */
  constructor(
    protected readonly service: UserService,
    @Inject(REQUEST) private readonly request: FastifyRequestInterface,
  ) {}

  /**
   * Transformer
   * @param {any} value Evaluating
   * @returns {number | string | ObjectID} Value
   */
  async transform(value: any): Promise<string | number | Types.ObjectId> {
    /**
     * Retrieve entity by id , if isn't undefined
     */
    const { id, organization } = this.request.params as any;
    const identifier = organization || id;
    if (!identifier) return value;
    let entity = undefined;

    try {
      entity = await this.service.get(identifier);
    } catch {}

    /**
     * Check if entity exists & attach to request locals
     */
    if (!entity) throw this.service._NotFoundException();
    this.request.locals.user = entity;
    return value;
  }
}
