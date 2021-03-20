import { PipeTransform, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Types } from 'mongoose';

/**
 * Import local objects
 */
import { ConversationService } from '../conversation.service';
import { FastifyRequestInterface } from '../../common';

/**
 * Loader Class
 */
export class Loader implements PipeTransform {
  /**
   * Constructor of Loader Class
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
  async transform(value: any): Promise<string | number | Types.ObjectId> {
    /**
     * Retrieve entity by id , if isn't undefined
     */
    const { id, conversation } = this.request.params as any;
    const identifier = conversation || id;
    if (!identifier) return value;
    let entity = undefined;

    try {
      entity = await this.service.get(identifier);
    } catch {}

    /**
     * Check if entity exists & attach to request locals
     */
    if (!entity) throw this.service._NotFoundException();
    this.request.locals.conversation = entity;
    return value;
  }
}
