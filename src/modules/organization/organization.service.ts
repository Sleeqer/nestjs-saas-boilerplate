import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

/**
 * Import local modules
 */
import { BaseEntityService } from '../common/entity/service';
import { Organization, OrganizationDocument } from './organization.entity';

/**
 * Organization Service Class
 */
@Injectable()
export class OrganizationService extends BaseEntityService<OrganizationDocument> {
  /**
   * Organization
   */
  protected entity: string = 'Organization';

  /**
   * Constructor of Organization Service Class
   * @param {Model<Organization>} repository Organization repository
   * @param {EventEmitter2} emitter Event emitter
   */
  constructor(
    @InjectModel(Organization.name)
    protected readonly repository: Model<OrganizationDocument>,
    protected readonly emitter: EventEmitter2,
  ) {
    super(repository, emitter);
  }
}
