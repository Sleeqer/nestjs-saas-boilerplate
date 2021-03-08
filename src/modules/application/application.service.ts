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
  ApplicationCreatePayload,
  ApplicationReplacePayload,
  ApplicationUpdatePayload,
} from './payload';
import { ApplicationEvent } from './event';
import { ApplicationEventEnum } from './enum';
import { Pagination, Query } from '../entity/pagination';
import { Application, ApplicationDocument } from './application.entity';

/**
 * Application Service Class
 */
@Injectable()
export class ApplicationService {
  /**
   * Application
   */
  entity: string = 'Application';

  /**
   * Constructor of Application Service Class
   * @param {Model<Application>} repository Application repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(Application.name)
    private readonly repository: Model<ApplicationDocument>,
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
   * Retrieve Application objects
   * @returns {Promise<Application[]>} Application objects
   */
  async all(): Promise<Application[]> {
    /**
     * Application objects
     */
    return this.repository.find().exec();
  }

  /**
   * Paginate Application objects by parameters
   * @param {Query} parameters Pagination query parameters
   * @returns {Promise<Pagination<Application>>} Paginated Application objects
   */
  async paginate({
    page = 1,
    limit = 15,
    order = {},
  }: Query): Promise<Pagination<Application>> {
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
     * Paginated Application objects
     */
    return new Pagination<Application>({
      results,
      total,
      page,
      limit,
    });
  }

  /**
   * Retrieve Application by id
   * @param {number | string } id Application's id
   * @returns {Promise<Application>} Application object
   */
  async get(id: number | string): Promise<Application> {
    return this.repository.findById(id).exec();
  }

  /**
   * Retrieve Application by dynamic key
   * @param {any} value Application's value
   * @param {string} key Application's key
   * @returns {Promise<Application>} Application object
   */
  async by(value: any, key: string = 'key'): Promise<Application> {
    return this.repository.findOne({ [key]: value }).exec();
  }

  /**
   * Create Application by payload
   * @param {ApplicationCreatePayload} payload Application's payload
   * @returns {Promise<Application>} Application object
   */
  async create(payload: ApplicationCreatePayload): Promise<Application> {
    const entity: Application = await new this.repository(payload).save();

    /**
     * Application Created Event Emit
     */
    this._created(entity);
    return entity;
  }

  /**
   * Update Application by id
   * @param {number | string } id Application's id
   * @param {ApplicationUpdatePayload} payload Application's payload
   * @returns {Promise<UpdateResult>} Update result
   */
  async update(
    id: number | string,
    payload: ApplicationUpdatePayload,
  ): Promise<Application> {
    const entity = await this.repository.updateOne({ id }, payload).exec();

    /**
     * Application Updated Event Emit
     */
    this._updated(id);
    return this.get(id);
  }

  /**
   * Update Application
   * @param {Application} entity Application
   * @param {ApplicationUpdatePayload} payload Application's payload
   * @returns {Promise<Application} Updated Application
   */
  async save(
    entity: Application,
    payload: ApplicationUpdatePayload,
  ): Promise<Application> {
    entity = await this.repository.findOneAndUpdate(
      { _id: entity._id },
      payload,
      { new: true },
    );

    /**
     * Application Updated Event Emit
     */
    this._updated(entity);
    return entity;
  }

  /**
   * Replace Application by id
   * @param {number | string } id Application's id
   * @param {ApplicationReplacePayload} payload Application's payload
   * @returns {Promise<Application>} Application object
   */
  async replace(
    id: number | string,
    payload: ApplicationReplacePayload,
  ): Promise<Application> {
    const entity = await this.repository.findOneAndUpdate(
      { _id: new CastObjectID(id) } as any,
      { ...payload },
      {
        new: true,
        upsert: true,
      },
    );

    /**
     * Application Updated Event Emit
     */
    this._updated(entity);
    return entity;
  }

  /**
   * Destroy Application by id
   * @param {number | string } id Application's id
   * @returns {Promise<DeleteResult>} Delete result
   */
  async destroy(id: number | string): Promise<Application> {
    const entity = await this.repository.deleteOne({ id }).exec();

    /**
     * Application Deleted Event Emit
     */
    this._deleted(id);
    return;
  }

  /**
   * Destroy Application by id
   * @param {Application} entity Application
   * @returns {Promise<Application>} Deleted Application
   */
  async remove(entity: Application): Promise<Application> {
    await this.repository.deleteOne(entity);

    /**
     * Deleted Application
     */
    this._deleted(entity);
    return entity;
  }

  /**
   * Application Created Event Emitter
   * @param {Application | number | string } id Application's id | object
   * @returns {Promise<void>} Void
   */
  async _created(entity: Application | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new ApplicationEvent<Application>(
      ApplicationEventEnum.CREATED,
      entity,
    );
    this.emitter.emit(event.title, event);
  }

  /**
   * Application Updated Event Emitter
   * @param {Application | number | string } id Application's id | object
   * @returns {Promise<void>} Void
   */
  async _updated(entity: Application | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new ApplicationEvent<Application>(
      ApplicationEventEnum.UPDATED,
      entity,
    );
    this.emitter.emit(event.title, event);
  }

  /**
   * Application Deleted Event Emitter
   * @param {Application | number | string } id Application's id | object
   * @returns {Promise<void>} Void
   */
  async _deleted(entity: Application | number | string): Promise<void> {
    if (!this.emitter) return;
    const event = new ApplicationEvent<Application>(
      ApplicationEventEnum.DELETED,
      entity,
    );
    this.emitter.emit(event.title, event);
  }
}
