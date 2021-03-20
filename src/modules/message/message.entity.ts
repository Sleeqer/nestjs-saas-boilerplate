import { Schema as BaseSchema, Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';
import { User } from '../user/user.entity';
import { MessageTypeEnum } from './enum';

/**
 * Message Document
 */
export type MessageDocument = Message & Document;

/**
 * Message Class
 */
@ObjectType()
@Schema({ ...SchemaOptions })
export class Message extends BaseEntity {
  /**
   * Author field
   */
  @Field(() => User, { nullable: true })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: User.name })
  author: User;

  /**
   * Content field
   */
  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    required: false,
    default: '',
  })
  content: string = '';

  /**
   * Type field
   */
  @Field(() => String, { nullable: false })
  @Prop({
    type: String,
    required: true,
    default: MessageTypeEnum.DEFAULT,
  })
  type: MessageTypeEnum = MessageTypeEnum.DEFAULT;

  /**
   * Conversation field
   */
  @Field(() => BaseEntity, { nullable: false })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: 'Conversation' })
  conversation?: BaseEntity | Types.ObjectId;
}

/**
 * Export Message Schema
 */
export const MessageSchema = SchemaFactory.createForClass(Message);
