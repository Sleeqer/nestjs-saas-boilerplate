import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * Import local objects
 */
import { GuardsPropertyObjectInterface } from '../../authorization/guards/decorators';
import { ConversationService } from '../../conversation/conversation.service';
import { FastifyRequestInterface } from '../../common/interfaces';
import { guardor } from '../../common/helpers';

/**
 * Conversation Guards Class
 */
@Injectable()
export class ConversationGuards implements CanActivate {
  /**
   * Constructor of Conversation Guards Class
   * @param {Reflector} reflector Reflector
   * @param {ConversationService} conversation Conversation Service
   */
  constructor(
    private reflector: Reflector,
    private readonly conversation: ConversationService,
  ) {}

  /**
   * Retrieve conversation & validates token
   * @param {FastifyRequestInterface} request Request
   * @returns {Promise<boolean>} Scope
   */
  async conversationer(
    request: FastifyRequestInterface,
    shield: GuardsPropertyObjectInterface,
  ): Promise<boolean> {
    const evaluation = { scope: false };
    const { user } = request;
    const { context } = guardor(this, shield, request);

    try {
      const conversation = !request.locals.conversation
        ? await this.conversation.get(context)
        : request.locals.conversation;

      request.locals.conversation = conversation;
      const condition = conversation.members_ids.includes(user._id);
      evaluation.scope = conversation && condition;
    } catch {
      evaluation.scope = false;
    }

    return evaluation.scope;
  }

  /**
   * Check whenever guard succeeds
   * @param {ExecutionContext} context
   * @returns {boolean | Promise<boolean> | Observable<boolean>}
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const property: GuardsPropertyObjectInterface = this.reflector.get(
      'guards.property',
      context.getHandler(),
    );

    const request: FastifyRequestInterface = context
      .switchToHttp()
      .getRequest();

    return this.conversationer(request, property);
  }
}
