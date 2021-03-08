import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Application Document
 */
export type ApplicationDocument = Application & Document;

/**
 * Application Schema
 */
@Schema()
export class Application {
  readonly _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  key: string;
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
