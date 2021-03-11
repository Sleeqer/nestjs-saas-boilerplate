import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

/**
 * Import local objects
 */
import { Profile } from '../profile/profile.entity';
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Organization Document
 */
export type OrganizationDocument = Organization & Document;

/**
 * Organization Schema
 */
@ObjectType()
@Schema(SchemaOptions)
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

  @Field(() => String, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Profile.name })
  profile?: Profile;
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
