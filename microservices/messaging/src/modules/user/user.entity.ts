import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

/**
 * Import local objects
 */
import { AppRoles } from '../app/app.roles';
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * User Document
 */
export type UserDocument = User & Document;

/**
 * User Schema
 */
@ObjectType()
@Schema(SchemaOptions)
export class User extends BaseEntity {
  @Field(() => String)
  @Prop({ required: true })
  first_name: string;

  @Field(() => String)
  @Prop()
  last_name: string;

  @Field(() => String)
  @Prop()
  username: string;

  @Field(() => String)
  @Prop()
  email: string;

  @Field(() => String)
  @Prop()
  sso: string;

  @Field(() => [String])
  @Prop({ type: [{ type: String }] })
  roles: AppRoles;
}

/**
 * Export User Schema
 */
export const UserSchema = SchemaFactory.createForClass(User);
