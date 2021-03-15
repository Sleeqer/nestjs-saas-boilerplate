import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

/**
 * Import local modules
 */
import { BaseEntityService } from '../common/entity/service';
import { Payload } from '../common/entity/controller';
import { User, UserDocument } from './user.entity';

/**
 * User Service Class
 */
@Injectable()
export class UserService extends BaseEntityService<UserDocument> {
  /**
   * User
   */
  protected entity: string = 'User';

  /**
   * Constructor of User Service Class
   * @param {Model<User>} repository User repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(User.name)
    protected readonly repository: Model<UserDocument>,
    protected readonly emitter: EventEmitter2,
  ) {
    super(repository, emitter);
  }

  /**
   * Create Entity by payload
   * @param {Payload} payload Entity's payload
   * @returns {Promise<UserDocument>} Entity object
   */
  async create(payload: Payload): Promise<UserDocument> {
    const current = await this.find({
      sso: payload.sso,
      application: payload.application,
    });
    if (current) throw this._ConflictException();

    /**
     * Create Entity
     */
    const entity: UserDocument = await new this.repository(payload).save();

    /**
     * Entity Created Event Emit
     */
    this._created(entity);
    return entity;
  }
}
