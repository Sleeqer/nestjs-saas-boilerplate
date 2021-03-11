import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

/**
 * Import local modules
 */
import { BaseEntityService } from '../common/entity/service';
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
}
