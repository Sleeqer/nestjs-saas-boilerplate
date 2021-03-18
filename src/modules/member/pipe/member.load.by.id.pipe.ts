import { PipeTransform, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectID } from 'typeorm';

/**
 * Import local objects
 */
import { UserService } from '../../user/user.service';
import { FastifyRequestInterface } from '../../common/interfaces';

/**
 * Member Load By Id Pipe Class
 */
export class Loader implements PipeTransform {
  /**
   * Constructor of Member Load By Id Pipe Class
   * @param {UserService} service Member Service
   * @param {FastifyRequestInterface} request Request
   */
  constructor(
    protected readonly service: UserService,
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
    this.request.locals.member = entity;
    return value;
  }
}
