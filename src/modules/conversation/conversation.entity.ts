import { Document, Schema as BaseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';
import { Member } from '../member/member.entity';
import { User } from '../user/user.entity';

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
  /**
   * Title field
   */
  @Field(() => String)
  @Prop({ required: true })
  title: string;

  /**
   * Description field
   */
  @Field(() => String)
  @Prop()
  description: string;

  /**
   * Members field
   */
  @Field(() => [Member], { nullable: true })
  @Prop([Member])
  members?: Member[];

  /**
   * Author field
   */
  @Field(() => User, { nullable: true })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: User.name })
  author?: User;

  /**
   * Members counts field
   */
  readonly members_counts?: Number;

  /**
   * Members ids field
   */
  readonly members_ids?: Array<string | Types.ObjectId>;
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
    (profile: Member) => profile?.user?._id || profile?.user,
  );
});
