import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  LeanDocument,
  PopulateOptions,
} from 'mongoose';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Import local modules
 */
import { populate } from '../../../common/helpers';
import { EntityEvent } from '../../../entity/event';
import { EntityEventEnum } from '../../../entity/enum';
import { Pagination, Query } from '../pagination';
import { Payload } from '../../../common/entity/controller';

/**
 * Schema Type for FilterQuery
 */
export type Schema = {
  /**
   * @type {number|string}
   */
  _id: number | string;

  /**
   * Any other keys
   */
  [key: string]: any;
};

/**
 * Base Entity Service Class
 */
@Injectable()
export class BaseEntityService<Entity extends Document> {
  /**
   * Entity
   */
  protected entity: string = 'Entity';

  /**
   * Populator
   */
  protected populator: Array<string> = [];

  /**
   * Constructor of Entity Service Class
   * @param {Model<Entity>} repository Entity repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    protected readonly repository: Model<Entity>,
    protected readonly emitter?: EventEmitter2,
  ) {}

  /**
   * Unknown entity error
   * @param {string | Array<string>} context Exception message
   * @returns {NotFoundException} NotFoundException instance
   */
  _NotFoundException(context: string = ''): NotFoundException {
    const message = `${this.entity} could not be found.`;
    return new NotFoundException(context || message);
  }

  /**
   * Forbidden entity error
   * @param {string | Array<string>} context Exception message
   * @returns {ForbiddenException} ForbiddenException instance
   */
  _ForbiddenException(context: string = '') {
    const message = `${this.entity} already exists.`;
    return new ForbiddenException(context || message);
  }

  /**
   * Bad exception entity error
   * @param {string | Array<string>} context Exception message
   * @returns {BadRequestException} BadRequestException instance
   */
  _BadRequestException(context?: string | Array<string>): BadRequestException {
    const message = `${this.entity} already exists.`;
    return new BadRequestException(context || message);
  }

  /**
   * Conflict exception entity error
   * @param {string | Array<string>} context Exception message
   * @returns {ConflictException} ConflictException instance
   */
  _ConflictException(context?: string | Array<string>): ConflictException {
    const message = `${this.entity} already exists.`;
    return new ConflictException(context || message);
  }

  /**
   * Unauthorized exception entity error
   * @param {string | Array<string>} context Exception message
   * @returns {UnauthorizedException} UnauthorizedException instance
   */
  _UnauthorizedException(
    context?: string | Array<string>,
  ): UnauthorizedException {
    const message = ``;
    return new UnauthorizedException(context || message);
  }

  /**
   * Populating schema
   * @param {Array<string>} populator Entity's populator
   * @returns {object[]} Entity object
   */
  _populate(populator: Array<string> = []): object[] {
    return populate([...populator, ...this.populator]);
  }

  /**
   * Save Entity's object
   * @param {Entity} entity Entity's object
   * @returns {Promise<Entity>} Entity's object
   */
  async save(entity: Entity): Promise<Entity> {
    entity = await entity.save();
    const object: Entity = await entity
      .populate(this._populate() as PopulateOptions[])
      .execPopulate();

    /**
     * Entity Updated Event Emit
     */
    this._updated(object);
    return object;
  }

  /**
   * Retrieve Entity objects
   * @param {FilterQuery<Schema>} query Entity's query
   * @returns {Promise<Entity[]>} Entity's objects
   */
  async all(query: FilterQuery<Schema> = {}): Promise<Entity[]> {
    /**
     * Entity objects
     */
    return this.repository.find(query).exec();
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
    filter = {},
    populator = [],
  }: Query): Promise<Pagination<Entity>> {
    /**
     * Find entities
     */
    const total = await this.repository.countDocuments(filter).exec();
    const results = await this.repository
      .find(filter)
      .sort(order)
      .populate(this._populate(populator))
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
   * Retrieve Entity by key value
   * @param {number | string | string[]} value Entity's value
   * @param {string} key Entity's key
   * @returns {Promise<Entity>} Entity object
   */
  async by(
    value: number | string | string[],
    key: string = 'key',
  ): Promise<Entity> {
    return this.repository
      .findOne({ [key]: value } as FilterQuery<Schema>)
      .populate(this._populate())
      .exec();
  }

  /**
   * Retrieve Entity by query
   * @param {FilterQuery<Schema>} query Entity's query
   * @returns {Promise<Entity>} Entity object
   */
  async find(query: FilterQuery<Schema>): Promise<Entity> {
    return this.repository.findOne(query).populate(this._populate()).exec();
  }

  /**
   * Retrieve Entity by id
   * @param {number | string} id Entity's id
   * @param {Array<string>} populator Entity's populator
   * @returns {Promise<Entity>} Entity object
   */
  async get(
    id: number | string,
    populator: Array<string> = [],
  ): Promise<Entity> {
    return this.repository
      .findById(id)
      .populate(this._populate(populator))
      .exec();
  }

  /**
   * Create Entity by payload
   * @param {Payload} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  async create(payload: Payload): Promise<Entity> {
    const entity: Entity = await new this.repository(payload).save();
    const object: Entity = await entity
      .populate(this._populate() as PopulateOptions[])
      .execPopulate();

    /**
     * Entity Created Event Emit
     */
    this._created(object);
    return object;
  }

  /**
   * Update Entity by payload
   * @param {Entity} entity Entity's object
   * @param {UpdateQuery<Entity>} payload Entity's payload
   * @returns {Promise<Entity} Updated Entity
   */
  async update(
    entity: Entity,
    payload: UpdateQuery<Entity>,
  ): Promise<Entity | LeanDocument<Entity>> {
    entity = await this.repository
      .findOneAndUpdate(
        { _id: entity._id } as FilterQuery<Schema>,
        { ...payload },
        {
          new: true,
        },
      )
      .populate(this._populate())
      .exec();

    /**
     * Entity Updated Event Emit
     */
    this._updated(entity);
    return entity;
  }

  /**
   * Replace Entity by id
   * @param {number | string} _id Entity's id
   * @param {UpdateQuery<Entity>} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  async replace(
    _id: number | string,
    payload: UpdateQuery<Entity>,
  ): Promise<Entity> {
    const entity = await this.repository
      .findOneAndUpdate(
        { _id } as FilterQuery<Schema>,
        { ...payload },
        {
          new: true,
          upsert: true,
        },
      )
      .populate(this._populate())
      .exec();

    /**
     * Entity Updated Event Emit
     */
    this._updated(entity);
    return entity;
  }

  /**
   * Destroy Entity by _id
   * @param {number | string} _id Entity's _id
   * @returns {Promise<void>} Void
   */
  async destroy(_id: number | string): Promise<void> {
    await this.repository.deleteOne({ _id } as FilterQuery<Schema>).exec();

    /**
     * Entity Deleted Event Emit
     */
    this._deleted(_id);
    return;
  }

  /**
   * Entity Created Event Emitter
   * @param {Entity | number | string} entity Entity's _id || object
   * @returns {Promise<void>} Void
   */
  async _created(entity: Entity | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new EntityEvent<Entity>(EntityEventEnum.CREATED, entity);
    this.emitter.emit(event.title, event);
    return;
  }

  /**
   * Entity Updated Event Emitter
   * @param {Entity | LeanDocument<Entity> | number | string} entity Entity's _id || object
   * @returns {Promise<void>} Void
   */
  async _updated(
    entity: Entity | LeanDocument<Entity> | number | string,
  ): Promise<void> {
    if (!this.emitter) return;
    const event = new EntityEvent<Entity>(EntityEventEnum.UPDATED, entity);
    this.emitter.emit(event.title, event);
    return;
  }

  /**
   * Entity Deleted Event Emitter
   * @param {Entity | number | string} entity Entity's _id || object
   * @returns {Promise<void>} Void
   */
  async _deleted(entity: Entity | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new EntityEvent<Entity>(EntityEventEnum.DELETED, entity);
    this.emitter.emit(event.title, event);
  }
}
