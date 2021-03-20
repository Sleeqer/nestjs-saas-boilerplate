import { Document } from 'mongoose';

/**
 * Import local objects
 */
import { FastifyRequestInterface } from '../../interfaces';
import { BaseEntityService } from '../service';
import { Pagination } from '../pagination';

/**
 * Payload Class
 */
export class Payload {
  /**
   * Key field
   */
  [key: string]: any;
}

/**
 * Base Entity Controller Class
 */
export class BaseEntityController<Entity, Base extends Document> {
  /**
   * Constructor of Entity Controller Class
   * @param {BaseEntityService} service Base Entity Service
   */
  constructor(protected readonly service: BaseEntityService<Base>) {}

  /**
   * Paginate Entity objects by parameters
   * @param {Payload} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Entity>>} Paginated Entity objects
   */
  async index?(
    parameters: Payload,
    request: FastifyRequestInterface,
  ): Promise<Pagination<Entity>>;

  /**
   * Retrieve Entity by id
   * @param {number | string} id Entity's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Entity>} Entity object
   */
  async get?(
    id: number | string,
    request: FastifyRequestInterface,
  ): Promise<Entity>;

  /**
   * Replace Entity by id
   * @param {number | string} id Entity's id
   * @param {Payload} payload Entity's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Entity>} Entity object
   */
  async replace?(
    id: number | string,
    payload: Payload,
    request: FastifyRequestInterface,
  ): Promise<Entity>;

  /**
   * Update Entity by id
   * @param {number | string} id Entity's id
   * @param {EntityUpdatePayload} payload Entity's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Entity>} Entity's object
   */
  async update?(
    id: number | string,
    payload: Payload,
    request: FastifyRequestInterface,
  ): Promise<Entity>;

  /**
   * Delete Entity by id
   * @param {number | string} id Entity's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  async destroy?(
    id: number | string,
    request: FastifyRequestInterface,
  ): Promise<object>;

  /**
   * Create Entity by payload
   * @param {Payload} payload Entity's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Entity>} Entity's object
   */
  async create?(
    payload: Payload,
    request: FastifyRequestInterface,
  ): Promise<Entity>;
}
