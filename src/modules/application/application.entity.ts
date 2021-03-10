import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Import local objects
 */
import { Organization } from '../organization/organization.entity';
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Application Document
 */
export type ApplicationDocument = Application & Document;

/**
 * Application Schema
 */
@Schema(SchemaOptions)
export class Application extends BaseEntity {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  key?: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organization?: Organization;
}

/**
 * Export Application Schema
 */
export const ApplicationSchema = SchemaFactory.createForClass(Application);

/**
 * Application Schema Hooks
 */
ApplicationSchema.pre('save', function () {
  const self: any = this as unknown;
  self.key = uuidv4();
});
