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
  /**
   * Email field
   */
  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  email: string;

  /**
   * Roles field
   */
  @Field(() => [String], { nullable: true })
  @Prop({ type: [{ type: String }], required: false })
  roles: AppRoles;

  /**
   * Password field
   */
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  password: string;

  /**
   * First name field
   */
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  first_name: string;

  /**
   * Last name field
   */
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  last_name: string;

  /**
   * Name field
   */
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  name: string;

  /**
   * Organizations field
   */
  @Field(() => [BaseEntity], { nullable: true })
  @Prop({ type: [{ type: BaseSchema.Types.ObjectId, ref: 'Organization' }] })
  organizations?: BaseEntity;
}

/**
 * Export Profile Schema
 */
export const ProfileSchema = SchemaFactory.createForClass(Profile);
