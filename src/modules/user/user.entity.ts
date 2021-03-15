import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

/**
 * Import local objects
 */
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
  @Field(() => String, { nullable: false })
  @Prop({ required: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  first_name: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  last_name: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  picture: string;

  @Field(() => String)
  @Prop()
  sso: string;
}

/**
 * Export User Schema
 */
export const UserSchema = SchemaFactory.createForClass(User);
