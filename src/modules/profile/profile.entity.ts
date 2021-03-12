import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as BaseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { AppRoles } from '../app/app.roles';
import { Organization } from '../organization/organization.entity';

/**
 * Profile Document
 */
export type ProfileDocument = Profile & Document;

/**
 * Profile Schema
 */
@ObjectType()
@Schema()
export class Profile {
  readonly _id: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  username: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  password: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  avatar: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [{ type: String }] })
  roles: AppRoles;

  @Field(() => [Organization], { nullable: true })
  @Prop({ type: [{ type: BaseSchema.Types.ObjectId, ref: 'Organization' }] })
  organizations?: Organization;
}

/**
 * Export Profile Schema
 */
export const ProfileSchema = SchemaFactory.createForClass(Profile);
