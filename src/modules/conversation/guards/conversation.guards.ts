import { Observable } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Import local objects
 */
import { FastifyRequestInterface } from '../../common/interfaces';
import { ConversationService } from '../../conversation/conversation.service';
import { GuardsPropertyObjectInterface } from '../../authorization/guards/decorators';

/**
 * Conversation Guards Class
 */
@Injectable()
export class ConversationGuards implements CanActivate {
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
    const current = shield?.guards
      ? this instanceof (shield?.guards as Function)
      : undefined;
    const evaluation = { scope: false };
    const { user } = request;
    const location: string =
      (current ? shield?.location : 'params') || 'params';
    const field: string = (current ? shield?.property : 'id') || 'id';
    const params: any = request[location];

    try {
      const conversation = !request.locals.conversation
        ? await this.conversation.get(params[field])
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
