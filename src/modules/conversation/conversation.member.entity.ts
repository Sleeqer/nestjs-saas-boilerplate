import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as BaseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Import local objects
 */
import { User } from '../user/user.entity';
import { AppRoles } from '../app/app.roles';
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Conversation Member Settings Class
 */
@ObjectType()
export class ConversationMemberSettings {
  @Field(() => String)
  @Prop({ required: false, default: false })
  notifications: boolean = false;
}

/**
 * Conversation Member Class
 */
@ObjectType()
@Schema(SchemaOptions)
export class ConversationMember extends BaseEntity {
  @Field(() => User, { nullable: true })
  @Prop({ type: BaseSchema.Types.ObjectId, ref: User.name })
  user: User;

  @Field(() => ConversationMemberSettings)
  @Prop({ required: false, default: new ConversationMemberSettings() })
  settings?: ConversationMemberSettings;

  @Field(() => [String], { nullable: true })
  @Prop({
    type: [{ type: String }],
    required: false,
    default: AppRoles.DEFAULT,
  })
  roles: AppRoles;
}
