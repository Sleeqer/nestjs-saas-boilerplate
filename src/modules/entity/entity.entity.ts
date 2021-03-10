import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Entity Document
 */
export type EntityDocument = Entity & Document;

/**
 * Entity Schema
 */

@Schema(SchemaOptions)
export class Entity extends BaseEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false, default: '' })
  description: string = '';

  @Prop({ required: false })
  key?: string;
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
