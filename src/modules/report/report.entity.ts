import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as BaseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';
import { Conversation } from '../conversation/conversation.entity';
import { User } from '../user/user.entity';
import { ReportReasonEnum } from './enum';

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
  /**
   * Title field
   */
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  title: string;

  /**
   * Description field
   */
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  description: string;

  /**
   * Reason field
   */
  @Field(() => String, { nullable: false })
  @Prop({ required: true, default: ReportReasonEnum.OTHER })
  reason: string;

  /**
   * Reporter field
   */
  @Field(() => User, { nullable: false })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: User.name })
  reporter: User;

  /**
   * Conversation field
   */
  @Field(() => Conversation, { nullable: true })
  @Prop({
    required: false,
    type: BaseSchema.Types.ObjectId,
    ref: Conversation.name,
    default: null,
  })
  conversation: Conversation;

  /**
   * User field
   */
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
