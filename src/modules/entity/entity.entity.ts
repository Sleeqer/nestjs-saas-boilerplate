import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entity Document
 */
export type EntityDocument = Entity & Document;

/**
 * Entity Schema
 */
@Schema()
export class Entity {
  readonly _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  key: string;
}

/**
 * Export Entity Schema
 */
export const EntitySchema = SchemaFactory.createForClass(Entity);

/**
 * Entity Schema Hooks
 */
EntitySchema.pre('save', function () {
  const self: any = this as unknown;
  self.key = uuidv4();
});
