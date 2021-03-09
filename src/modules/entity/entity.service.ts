import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

/**
 * Import local modules
 */
import { InjectModel } from '@nestjs/mongoose';
import { Entity, EntityDocument } from './entity.entity';
import { EntityService as BaseEntityService } from '../common/entity/service';

/**
 * Entity Service Class
 */
@Injectable()
export class EntityService extends BaseEntityService<EntityDocument> {
  /**
   * Entity
   */
  protected entity: string = 'Entity';

  /**
   * Constructor of Entity Service Class
   * @param {Model<Entity>} repository Entity repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(Entity.name)
    protected readonly repository: Model<EntityDocument>,
    protected readonly emitter?: EventEmitter2,
  ) {
    super(repository, emitter);
  }
}
