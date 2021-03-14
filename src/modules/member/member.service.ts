import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

/**
 * Import local modules
 */
import { BaseEntityService } from '../common/entity/service';
import { Member, MemberDocument } from './member.entity';

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
}
