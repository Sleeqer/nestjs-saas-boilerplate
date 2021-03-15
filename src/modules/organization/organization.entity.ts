import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as BaseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Organization Document
 */
export type OrganizationDocument = Organization & Document;

/**
 * Organization Schema
 */
@ObjectType()
@Schema({ ...SchemaOptions, collection: 'organizations_entities' })
export class Organization extends BaseEntity {
  @Field(() => String, { nullable: false })
  @Prop({ required: true })
  title: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  description: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  key?: string;

  @Field(() => BaseEntity, { nullable: true })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: 'Member' })
  member?: BaseEntity;
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
