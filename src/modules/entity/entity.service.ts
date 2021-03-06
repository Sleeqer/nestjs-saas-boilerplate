import { DeleteResult, Repository, UpdateResult, ObjectID } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID as CastObjectID } from 'mongodb';
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
import { Entity } from './entity.entity';
import { EntityEventEnum } from './enum';
import { Pagination, Query } from '../entity/pagination';

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
   * @param {Repository<Entity>} repository Entity repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectRepository(Entity)
    protected readonly repository: Repository<Entity>,
    private readonly emitter: EventEmitter2,
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
   * Paginate Entity objects by parameters
   * @param {Query} parameters Pagination query parameters
   * @returns {Promise<Pagination<Entity>>} Paginated Entity objects
   */
  async paginate({ page, limit, order }: Query): Promise<Pagination<Entity>> {
    /**
     * Find entities
     */
    const [results, total] = await this.repository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order,
    });

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
   * @param {number | string | ObjectID} id Entity's id
   * @returns {Promise<Entity>} Entity object
   */
  async get(id: number | string | ObjectID): Promise<Entity> {
    return this.repository.findOne(id);
  }

  /**
   * Create Entity by payload
   * @param {EntityCreatePayload} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  async create(payload: EntityCreatePayload): Promise<Entity> {
    const entity: Entity = await this.repository.save(
      this.repository.create(payload),
    );

    /**
     * Entity Created Event Emit
     */
    this._created(entity);
    return entity;
  }

  /**
   * Update Entity by id
   * @param {number | string | ObjectID} id Entity's id
   * @param {EntityUpdatePayload} payload Entity's payload
   * @returns {Promise<UpdateResult>} Update result
   */
  async update(
    id: number | string | ObjectID,
    payload: EntityUpdatePayload,
  ): Promise<UpdateResult> {
    const entity = await this.repository.update(id, payload);

    /**
     * Entity Updated Event Emit
     */
    this._updated(id);
    return entity;
  }

  /**
   * Replace Entity by id
   * @param {number | string | ObjectID} id Entity's id
   * @param {EntityReplacePayload} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  async replace(
    id: number | string | ObjectID,
    payload: EntityReplacePayload,
  ): Promise<Entity> {
    if (id) payload._id = new CastObjectID(id);
    const entity = await this.repository.save(payload);

    /**
     * Entity Updated Event Emit
     */
    this._updated(entity);
    return entity;
  }

  /**
   * Destroy Entity by id
   * @param {number | string | ObjectID} id Entity's id
   * @returns {Promise<DeleteResult>} Delete result
   */
  async destroy(id: number | string | ObjectID): Promise<DeleteResult> {
    const entity = await this.repository.delete(id);

    /**
     * Entity Deleted Event Emit
     */
    this._deleted(id);
    return entity;
  }

  /**
   * Entity Created Event Emitter
   * @param {Entity | number | string | ObjectID} id Entity's id | object
   * @returns {Promise<void>} Void
   */
  async _created(entity: Entity | number | string | ObjectID): Promise<void> {
    const event = new EntityEvent<Entity>(EntityEventEnum.CREATED, entity);
    this.emitter.emit(event.title, event);
  }

  /**
   * Entity Updated Event Emitter
   * @param {Entity | number | string | ObjectID} id Entity's id | object
   * @returns {Promise<void>} Void
   */
  async _updated(entity: Entity | number | string | ObjectID): Promise<void> {
    const event = new EntityEvent<Entity>(EntityEventEnum.UPDATED, entity);
    this.emitter.emit(event.title, event);
  }

  /**
   * Entity Deleted Event Emitter
   * @param {Entity | number | string | ObjectID} id Entity's id | object
   * @returns {Promise<void>} Void
   */
  async _deleted(entity: Entity | number | string | ObjectID): Promise<void> {
    const event = new EntityEvent<Entity>(EntityEventEnum.DELETED, entity);
    this.emitter.emit(event.title, event);
  }
}
