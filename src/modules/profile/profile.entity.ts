import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as BaseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';
import { AppRoles } from '../app/app.roles';

/**
 * Profile Document
 */
export type ProfileDocument = Profile & Document;

/**
 * Profile Schema
 */
@ObjectType()
@Schema(SchemaOptions)
export class Profile extends BaseEntity {
  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  email: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [{ type: String }], required: false })
  roles: AppRoles;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  password: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  first_name: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  last_name: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  name: string;

  @Field(() => [BaseEntity], { nullable: true })
  @Prop({ type: [{ type: BaseSchema.Types.ObjectId, ref: 'Organization' }] })
  organizations?: BaseEntity;
}

/**
 * Export Profile Schema
 */
export const ProfileSchema = SchemaFactory.createForClass(Profile);
