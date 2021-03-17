import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as BaseSchema, Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { User } from '../user/user.entity';
import { AppRoles } from '../app/app.roles';
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Member Settings Class
 */
@ObjectType()
export class MemberSettings {
  @Field(() => String)
  @Prop({ required: false, default: false })
  notifications: boolean = false;
}

/**
 * Member Document
 */
export type MemberDocument = Member & Document;

/**
 * Member Class
 */
@ObjectType()
@Schema({ ...SchemaOptions })
export class Member extends BaseEntity {
  @Field(() => User, { nullable: true })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: User.name })
  user: User;

  @Field(() => MemberSettings)
  @Prop({ required: false, default: new MemberSettings() })
  settings?: MemberSettings;

  @Field(() => [String], { nullable: true })
  @Prop({
    type: [{ type: String }],
    required: false,
    default: AppRoles.DEFAULT,
  })
  roles: AppRoles;
}

/**
 * Export Member Schema
 */
export const MemberSchema = SchemaFactory.createForClass(Member);
