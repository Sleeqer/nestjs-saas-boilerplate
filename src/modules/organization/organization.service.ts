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
  OrganizationCreatePayload,
  OrganizationReplacePayload,
  OrganizationUpdatePayload,
} from './payload';
import { OrganizationEvent } from './event';
import { OrganizationEventEnum } from './enum';
import { Pagination, Query } from '../entity/pagination';
import { Organization, OrganizationDocument } from './organization.entity';

/**
 * Organization Service Class
 */
@Injectable()
export class OrganizationService {
  /**
   * Organization
   */
  entity: string = 'Organization';

  /**
   * Constructor of Organization Service Class
   * @param {Model<Organization>} repository Organization repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(Organization.name)
    private readonly repository: Model<OrganizationDocument>,
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
   * Retrieve Organization objects
   * @returns {Promise<Organization[]>} Organization objects
   */
  async all(): Promise<Organization[]> {
    /**
     * Organization objects
     */
    return this.repository.find().exec();
  }

  /**
   * Paginate Organization objects by parameters
   * @param {Query} parameters Pagination query parameters
   * @returns {Promise<Pagination<Organization>>} Paginated Organization objects
   */
  async paginate({
    page = 1,
    limit = 15,
    order = {},
  }: Query): Promise<Pagination<Organization>> {
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
     * Paginated Organization objects
     */
    return new Pagination<Organization>({
      results,
      total,
      page,
      limit,
    });
  }

  /**
   * Retrieve Organization by id
   * @param {number | string } id Organization's id
   * @returns {Promise<Organization>} Organization object
   */
  async get(id: number | string): Promise<Organization> {
    return this.repository.findById(id).exec();
  }

  /**
   * Create Organization by payload
   * @param {OrganizationCreatePayload} payload Organization's payload
   * @returns {Promise<Organization>} Organization object
   */
  async create(payload: OrganizationCreatePayload): Promise<Organization> {
    const entity: Organization = await new this.repository(payload).save();

    /**
     * Organization Created Event Emit
     */
    this._created(entity);
    return entity;
  }

  /**
   * Update Organization by id
   * @param {number | string } id Organization's id
   * @param {OrganizationUpdatePayload} payload Organization's payload
   * @returns {Promise<UpdateResult>} Update result
   */
  async update(
    id: number | string,
    payload: OrganizationUpdatePayload,
  ): Promise<Organization> {
    const entity = await this.repository.updateOne({ id }, payload).exec();

    /**
     * Organization Updated Event Emit
     */
    this._updated(id);
    return this.get(id);
  }

  /**
   * Update Organization
   * @param {Organization} entity Organization
   * @param {OrganizationUpdatePayload} payload Organization's payload
   * @returns {Promise<Organization} Updated Organization
   */
  async save(
    entity: Organization,
    payload: OrganizationUpdatePayload,
  ): Promise<Organization> {
    entity = await this.repository.findOneAndUpdate(
      { _id: entity._id },
      payload,
      { new: true },
    );

    /**
     * Organization Updated Event Emit
     */
    this._updated(entity);
    return entity;
  }

  /**
   * Replace Organization by id
   * @param {number | string } id Organization's id
   * @param {OrganizationReplacePayload} payload Organization's payload
   * @returns {Promise<Organization>} Organization object
   */
  async replace(
    id: number | string,
    payload: OrganizationReplacePayload,
  ): Promise<Organization> {
    const entity = await this.repository.findOneAndUpdate(
      { _id: new CastObjectID(id) } as any,
      { ...payload },
      {
        new: true,
        upsert: true,
      },
    );

    /**
     * Organization Updated Event Emit
     */
    this._updated(entity);
    return entity;
  }

  /**
   * Destroy Organization by id
   * @param {number | string } id Organization's id
   * @returns {Promise<DeleteResult>} Delete result
   */
  async destroy(id: number | string): Promise<Organization> {
    const entity = await this.repository.deleteOne({ id }).exec();

    /**
     * Organization Deleted Event Emit
     */
    this._deleted(id);
    return;
  }

  /**
   * Destroy Organization by id
   * @param {Organization} entity Organization
   * @returns {Promise<Organization>} Deleted Organization
   */
  async remove(entity: Organization): Promise<Organization> {
    await this.repository.deleteOne(entity);

    /**
     * Deleted Organization
     */
    this._deleted(entity);
    return entity;
  }

  /**
   * Organization Created Event Emitter
   * @param {Organization | number | string } id Organization's id | object
   * @returns {Promise<void>} Void
   */
  async _created(entity: Organization | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new OrganizationEvent<Organization>(
      OrganizationEventEnum.CREATED,
      entity,
    );
    this.emitter.emit(event.title, event);
  }

  /**
   * Organization Updated Event Emitter
   * @param {Organization | number | string } id Organization's id | object
   * @returns {Promise<void>} Void
   */
  async _updated(entity: Organization | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new OrganizationEvent<Organization>(
      OrganizationEventEnum.UPDATED,
      entity,
    );
    this.emitter.emit(event.title, event);
  }

  /**
   * Organization Deleted Event Emitter
   * @param {Organization | number | string } id Organization's id | object
   * @returns {Promise<void>} Void
   */
  async _deleted(entity: Organization | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new OrganizationEvent<Organization>(
      OrganizationEventEnum.DELETED,
      entity,
    );
    this.emitter.emit(event.title, event);
  }
}
