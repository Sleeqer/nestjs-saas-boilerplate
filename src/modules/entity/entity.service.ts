import { EventEmitter2 } from '@nestjs/event-emitter';
import { ObjectID as CastObjectID } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

/**
 * Import local modules
 */
import {
  EntityCreatePayload,
  EntityReplacePayload,
  EntityUpdatePayload,
} from './payload';
import { EntityEvent } from './event';
import { EntityEventEnum } from './enum';
import { Pagination, Query } from '../entity/pagination';
import { Entity, EntityDocument } from './entity.entity';

/**
 * Entity Service Class
 */
@Injectable()
export class EntityService {
  /**
   * Entity
   */
  entity: string = 'Entity';

  /**
   * Constructor of Entity Service Class
   * @param {Model<Entity>} repository Entity repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(Entity.name)
    private readonly repository: Model<EntityDocument>,
    private readonly emitter?: EventEmitter2,
  ) {}

  /**
   * Unknown entity error
   * @param {string | Array<string>} context Exception message
   * @returns {NotFoundException} NotFoundException instance
   */
  _NotFoundException(context: string = '') {
    const message = `${this.entity} entity could not be found.`;
    return new NotFoundException(context || message);
  }

  /**
   * Forbidden entity error
   * @param {string | Array<string>} context Exception message
   * @returns {ForbiddenException} ForbiddenException instance
   */
  _ForbiddenException(context: string = '') {
    const message = `${this.entity} entity already exists.`;
    return new ForbiddenException(context || message);
  }

  /**
   * Bad exception entity error
   * @param {string | Array<string>} context Exception message
   * @returns {BadRequestException} BadRequestException instance
   */
  _BadRequestException(context: string | Array<string>) {
    const message = `${this.entity} entity already exists.`;
    return new BadRequestException(context || message);
  }

  /**
   * Retrieve Entity objects
   * @returns {Promise<Entity[]>} Entity objects
   */
  async all(): Promise<Entity[]> {
    /**
     * Entity objects
     */
    return this.repository.find().exec();
  }

  /**
   * Paginate Entity objects by parameters
   * @param {Query} parameters Pagination query parameters
   * @returns {Promise<Pagination<Entity>>} Paginated Entity objects
   */
  async paginate({
    page = 1,
    limit = 15,
    order = {},
  }: Query): Promise<Pagination<Entity>> {
    /**
     * Find entities
     */
    const total = await this.repository.estimatedDocumentCount().exec();
    const results = await this.repository
      .find()
      .sort(order)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    /**
     * Paginated Entity objects
     */
    return new Pagination<Entity>({
      results,
      total,
      page,
      limit,
    });
  }

  /**
   * Retrieve Entity by id
   * @param {number | string } id Entity's id
   * @returns {Promise<Entity>} Entity object
   */
  async get(id: number | string): Promise<Entity> {
    return this.repository.findById(id).exec();
  }

  /**
   * Create Entity by payload
   * @param {EntityCreatePayload} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  async create(payload: EntityCreatePayload): Promise<Entity> {
    const entity: Entity = await new this.repository(payload).save();

    /**
     * Entity Created Event Emit
     */
    this._created(entity);
    return entity;
  }

  /**
   * Update Entity by id
   * @param {number | string } id Entity's id
   * @param {EntityUpdatePayload} payload Entity's payload
   * @returns {Promise<UpdateResult>} Update result
   */
  async update(
    id: number | string,
    payload: EntityUpdatePayload,
  ): Promise<Entity> {
    const entity = await this.repository.updateOne({ id }, payload).exec();

    /**
     * Entity Updated Event Emit
     */
    this._updated(id);
    return this.get(id);
  }

  /**
   * Update Entity
   * @param {Entity} entity Entity
   * @param {EntityUpdatePayload} payload Entity's payload
   * @returns {Promise<Entity} Updated Entity
   */
  async save(entity: Entity, payload: EntityUpdatePayload): Promise<Entity> {
    entity = await this.repository.findOneAndUpdate(
      { _id: entity._id },
      payload,
      { new: true },
    );

    /**
     * Entity Updated Event Emit
     */
    this._updated(entity);
    return entity;
  }

  /**
   * Replace Entity by id
   * @param {number | string } id Entity's id
   * @param {EntityReplacePayload} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  async replace(
    id: number | string,
    payload: EntityReplacePayload,
  ): Promise<Entity> {
    const entity = await this.repository.findOneAndUpdate(
      { _id: new CastObjectID(id) } as any,
      { ...payload },
      {
        new: true,
        upsert: true,
      },
    );

    /**
     * Entity Updated Event Emit
     */
    this._updated(entity);
    return entity;
  }

  /**
   * Destroy Entity by id
   * @param {number | string } id Entity's id
   * @returns {Promise<DeleteResult>} Delete result
   */
  async destroy(id: number | string): Promise<Entity> {
    const entity = await this.repository.deleteOne({ id }).exec();

    /**
     * Entity Deleted Event Emit
     */
    this._deleted(id);
    return;
  }

  /**
   * Destroy Entity by id
   * @param {Entity} entity Entity
   * @returns {Promise<Entity>} Deleted Entity
   */
  async remove(entity: Entity): Promise<Entity> {
    await this.repository.deleteOne(entity);

    /**
     * Deleted Entity
     */
    this._deleted(entity);
    return entity;
  }

  /**
   * Entity Created Event Emitter
   * @param {Entity | number | string } id Entity's id | object
   * @returns {Promise<void>} Void
   */
  async _created(entity: Entity | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new EntityEvent<Entity>(EntityEventEnum.CREATED, entity);
    this.emitter.emit(event.title, event);
  }

  /**
   * Entity Updated Event Emitter
   * @param {Entity | number | string } id Entity's id | object
   * @returns {Promise<void>} Void
   */
  async _updated(entity: Entity | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new EntityEvent<Entity>(EntityEventEnum.UPDATED, entity);
    this.emitter.emit(event.title, event);
  }

  /**
   * Entity Deleted Event Emitter
   * @param {Entity | number | string } id Entity's id | object
   * @returns {Promise<void>} Void
   */
  async _deleted(entity: Entity | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new EntityEvent<Entity>(EntityEventEnum.DELETED, entity);
    this.emitter.emit(event.title, event);
  }
}
