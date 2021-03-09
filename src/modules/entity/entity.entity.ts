import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entity Document
 */
export type EntityDocument = Entity & Document;

/**
 * Entity Schema
 */

@Schema({
  toObject: {
    transform: function (doc, ret, options) {
      return Object.setPrototypeOf(ret, Object.getPrototypeOf(new Entity()));
    },
  },
  timestamps: {
    createdAt: 'timestamp',
    updatedAt: 'edited_timestamp',
  },
})
export class Entity {
  @Transform((value) => (value?.value || value).toString(), {
    toPlainOnly: true,
  })
  readonly _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false, default: '' })
  description: string = '';

  @Prop()
  timestamp?: Date;

  @Prop()
  edited_timestamp?: Date;

  @Prop({ required: false })
  key?: string;

  @Exclude()
  readonly __v?: number;
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
