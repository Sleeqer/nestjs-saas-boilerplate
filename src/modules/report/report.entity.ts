import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as BaseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { User } from '../user/user.entity';
import { ReportReasonEnum } from './enum/report.reason.enum';
import { Conversation } from '../conversation/conversation.entity';
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Report Document
 */
export type ReportDocument = Report & Document;

/**
 * Report Schema
 */
@ObjectType()
@Schema(SchemaOptions)
export class Report extends BaseEntity {
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  title: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  description: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: true, default: ReportReasonEnum.OTHER })
  reason: string;

  @Field(() => User, { nullable: false })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: User.name })
  reporter: User;

  @Field(() => Conversation, { nullable: true })
  @Prop({
    required: false,
    type: BaseSchema.Types.ObjectId,
    ref: Conversation.name,
    default: null,
  })
  conversation: Conversation;

  @Field(() => User, { nullable: true })
  @Prop({
    required: false,
    type: BaseSchema.Types.ObjectId,
    ref: User.name,
    default: null,
  })
  user: User;
}

/**
 * Export Report Schema
 */
export const ReportSchema = SchemaFactory.createForClass(Report);
