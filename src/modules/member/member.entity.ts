import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Exclude } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Import local objects
 */
import { Organization } from '../organization/organization.entity';
import { SchemaOptions } from '../common/entity/entity';

/**
 * Member Document
 */
export type MemberDocument = Member & Document;

/**
 * Member Settings Token Class
 */
@ObjectType()
export class MemberSettingsToken {
  @ApiProperty({ required: false, default: '' })
  @Field(() => String)
  @Prop({ required: false, default: '' })
  secret: string = '';

  @ApiProperty({ required: false, default: '' })
  @Field(() => String)
  @Prop({ required: false, default: '' })
  property: string = '';
}

/**
 * Member Settings Class
 */
@ObjectType()
export class MemberSettings {
  @ApiProperty({
    required: true,
  })
  @Field(() => MemberSettingsToken)
  @Prop({
    required: false,
  })
  token: MemberSettingsToken = new MemberSettingsToken();
}

/**
 * Member Schema
 */
@ObjectType()
@Schema(SchemaOptions)
export class Member {
  @Field(() => String, { nullable: false })
  @Transform((value) => (value?.value || value).toString(), {
    toPlainOnly: true,
  })
  readonly _id: string;

  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => MemberSettings)
  @Prop({ required: false, default: new MemberSettings() })
  settings?: MemberSettings;

  @Field(() => String)
  @Prop()
  key?: string;

  @Field(() => String)
  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organization?: Organization;

  @Field(() => Date, { nullable: true })
  @Prop()
  timestamp?: Date;

  @Field(() => Date, { nullable: true })
  @Prop()
  edited_timestamp?: Date;

  @Exclude()
  @Prop()
  readonly __v?: number;
}

/**
 * Export Member Schema
 */
export const MemberSchema = SchemaFactory.createForClass(Member);

/**
 * Member Schema Hooks
 */
MemberSchema.pre('save', function () {
  const self: any = this as unknown;
  self.key = uuidv4();
});
