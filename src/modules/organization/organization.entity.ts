import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Import local objects
 */
import { Application } from '../application/application.entity';

/**
 * Organization Document
 */
export type OrganizationDocument = Organization & Document;

/**
 * Organization Schema
 */
@Schema()
export class Organization {
  readonly _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  key: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Application' }] })
  applications: Application[];
}

/**
 * Export Organization Schema
 */
export const OrganizationSchema = SchemaFactory.createForClass(Organization);

/**
 * Organization Schema Hooks
 */
OrganizationSchema.pre('save', function () {
  const self: any = this as unknown;
  self.key = uuidv4();
});
