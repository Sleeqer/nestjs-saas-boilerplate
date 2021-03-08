import { PipeTransform, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectID } from 'typeorm';

/**
 * Import local objects
 */
import { OrganizationService } from '../organization.service';
import { FastifyRequestInterface } from '../../common/interfaces';

/**
 * Organization Load By Id Pipe Class
 */
export class OrganizationLoadByIdPipe implements PipeTransform {
  /**
   * Constructor of Organization Load By Id Pipe Class
   * @param {OrganizationService} service Organization Service
   * @param {FastifyRequestInterface} request Request
   */
  constructor(
    protected readonly service: OrganizationService,
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
    this.request.locals.entity = entity;
    return value;
  }
}
