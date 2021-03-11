import { PipeTransform, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ObjectID } from 'typeorm';

/**
 * Import local objects
 */
import { ConversationService } from '../conversation.service';
import { FastifyRequestInterface } from '../../common/interfaces';

/**
 * Conversation Load By Id Pipe Class
 */
export class Loader implements PipeTransform {
  /**
   * Constructor of Conversation Load By Id Pipe Class
   * @param {ConversationService} service Conversation Service
   * @param {FastifyRequestInterface} request Request
   */
  constructor(
    protected readonly service: ConversationService,
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
    this.request.locals.organization = entity;
    return value;
  }
}
