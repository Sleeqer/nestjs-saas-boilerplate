import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as BaseSchema, Document } from 'mongoose';
import { IsBoolean, IsOptional } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';
import { AppRoles } from '../app/app.roles';
import { User } from '../user/user.entity';

/**
 * Member Settings Class
 */
@ObjectType()
export class MemberSettings {
  /**
   * Notifications field
   */
  @ApiProperty({
    required: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Field(() => String)
  @Type(() => Boolean)
  @Prop({ required: false, default: false })
  notifications: boolean;

  /**
   * Constructor of Member Settings Class
   */
  constructor(notifications?: boolean) {
    this.notifications = notifications;
  }
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
  /**
   * User field
   */
  @Field(() => User, { nullable: true })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: User.name })
  user: User;

  /**
   * Settings field
   */
  @Field(() => MemberSettings)
  @Prop({ required: false, default: new MemberSettings(false) })
  settings?: MemberSettings;

  /**
   * Roles field
   */
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
