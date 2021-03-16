import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as BaseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';
import { User } from '../user/user.entity';
import { ConversationMember } from './conversation.member.entity';

/**
 * Conversation Document
 */
export type ConversationDocument = Conversation & Document;

/**
 * Conversation Schema
 */
@ObjectType()
@Schema({ ...SchemaOptions, toJSON: { virtuals: true } })
export class Conversation extends BaseEntity {
  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => [ConversationMember], { nullable: true })
  @Prop([ConversationMember])
  members?: ConversationMember[];

  @Field(() => User, { nullable: true })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: User.name })
  owner?: User;

  readonly members_counts?: Number;
}

/**
 * Export Conversation Schema
 */
export const ConversationSchema = SchemaFactory.createForClass(Conversation);

/**
 * Conversation Schema Virtuals
 */
ConversationSchema.virtual('members_counts').get(function () {
  return this.members?.length || 0;
});

ConversationSchema.virtual('members_ids').get(function () {
  return this.members.map(
    (member: ConversationMember) => member?.user?._id || member?.user,
  );
});
