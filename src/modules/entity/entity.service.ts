import { DeleteResult, Repository, UpdateResult, ObjectID } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ObjectID as CastObjectID } from 'mongodb';

/**
 * Import local level objects
 */
import {
  EntityCreatePayload,
  EntityReplacePayload,
  EntityUpdatePayload,
} from './payload';
import { Entity } from './entity.entity';

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
   * @param {Repository<Entity>} repository
   */
  constructor(
    @InjectRepository(Entity)
    protected readonly repository: Repository<Entity>,
  ) {}

  /**
   * Retrieve Entity by id
   * @param {number | string | ObjectID} id Entity's id
   * @returns {Promise<Entity>} Entity object
   */
  async get(id: number | string | ObjectID): Promise<Entity> {
    return this.repository.findOne(id);
  }

  /**
   * Paginate Entity entities by options
   * @param {PaginationOptionsInterface} options Pagination options
   * @returns {Promise<Pagination<Entity>>} Data of paginated Entity entities
   */
  async paginate({ page, limit, order }: any): Promise<any> {
    /**
     * Find entities
     */
    const [results, total] = await this.repository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order,
    });

    return results;
  }

  /**
   * Destroy Entity by id
   * @param {number | string | ObjectID} id Entity's id
   * @returns {Promise<DeleteResult>} Delete result
   */
  async destroy(id: number | string | ObjectID): Promise<DeleteResult> {
    return this.repository.delete(id);
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
    return await this.repository.update(id, payload);
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
    return await this.repository.save(payload);
  }

  /**
   * Create Entity by payload
   * @param {EntityCreatePayload} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  async create(payload: EntityCreatePayload): Promise<Entity> {
    return this.repository.save(this.repository.create(payload));
  }
}
