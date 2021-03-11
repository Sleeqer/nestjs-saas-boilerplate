import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Import local objects
 */
import { AppRoles } from '../app/app.roles';
import { Organization } from '../organization/organization.entity';

/**
 * Profile Document
 */
export type ProfileDocument = Profile & Document;

/**
 * Profile Schema
 */
@Schema()
export class Profile {
  readonly _id: string;

  @Prop({ required: false })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ type: [{ type: String }] })
  roles: AppRoles;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Organization' }] })
  organizations: Organization[];
}

/**
 * Export Profile Schema
 */
export const ProfileSchema = SchemaFactory.createForClass(Profile);
