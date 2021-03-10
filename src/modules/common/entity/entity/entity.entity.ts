import { Transform, Exclude } from 'class-transformer';
import { Prop, Schema } from '@nestjs/mongoose';

/**
 * Schema options
 */
export const SchemaOptions = {
  toObject: {
    transform: function (document, ret, options) {
      return Object.setPrototypeOf(
        ret,
        Object.getPrototypeOf(new BaseEntity()),
      );
    },
  },
  timestamps: {
    createdAt: 'timestamp',
    updatedAt: 'edited_timestamp',
  },
};

/**
 * Entity Schema
 */
@Schema(SchemaOptions)
export class BaseEntity {
  @Transform((value) => (value?.value || value).toString(), {
    toPlainOnly: true,
  })
  readonly _id: string;

  @Prop()
  timestamp?: Date;

  @Prop()
  edited_timestamp?: Date;

  @Exclude()
  readonly __v?: number;
}
