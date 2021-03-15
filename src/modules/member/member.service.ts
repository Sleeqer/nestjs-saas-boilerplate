import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

/**
 * Import local modules
 */
import { BaseEntityService } from '../common/entity/service';
import { Member, MemberDocument } from './member.entity';
import { Payload } from '../common/entity/controller';
import { AppRoles } from '../app/app.roles';

/**
 * Member Service Class
 */
@Injectable()
export class MemberService extends BaseEntityService<MemberDocument> {
  /**
   * Member
   */
  protected entity: string = 'Member';

  /**
   * Constructor of Member Service Class
   * @param {Model<Member>} repository Member repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(Member.name)
    protected readonly repository: Model<MemberDocument>,
    protected readonly emitter: EventEmitter2,
  ) {
    super(repository, emitter);
  }

  /**
   * Create Entity by payload
   * @param {Payload} payload Entity's payload
   * @returns {Promise<MemberDocument>} Entity object
   */
  async create(payload: Payload): Promise<MemberDocument> {
    const current = await this.by(payload.email, 'email');
    if (current) throw this._ConflictException();

    /**
     * Create Entity
     */
    const entity: MemberDocument = await new this.repository({
      ...payload,
      password: payload.password
        ? crypto.createHmac('sha256', payload.password).digest('hex')
        : null,
      name: (payload.name
        ? payload.name
        : `${payload.first_name || ''} ${payload.last_name || ''}`
      ).trim(),
      roles: payload.roles ? payload.roles : AppRoles.DEFAULT,
    }).save();

    /**
     * Entity Created Event Emit
     */
    this._created(entity);
    return entity;
  }
}
