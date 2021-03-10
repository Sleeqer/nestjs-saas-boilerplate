import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

/**
 * Import local objects
 */
import { Application } from '../application/application.entity';
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Organization Document
 */
export type OrganizationDocument = Organization & Document;

/**
 * Organization Schema
 */
@Schema(SchemaOptions)
export class Organization extends BaseEntity {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  key?: string;
}

/**
 * Export Organization Schema
 */
export const OrganizationSchema = SchemaFactory.createForClass(Organization);

/**
 * Organization Schema Virtuals
 */
OrganizationSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'organization',
});

/**
 * Organization Schema Hooks
 */
OrganizationSchema.pre('save', function () {
  const self: any = this as unknown;
  self.key = crypto.createHmac('sha1', uuidv4()).digest('hex');
});
