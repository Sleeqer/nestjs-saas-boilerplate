import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as BaseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Conversation Document
 */
export type ConversationDocument = Conversation & Document;

/**
 * Conversation Schema
 */
@ObjectType()
@Schema(SchemaOptions)
export class Conversation extends BaseEntity {
  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => String)
  @Prop()
  name?: string;
}

/**
 * Export Conversation Schema
 */
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
