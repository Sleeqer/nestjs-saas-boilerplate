import { Transform, Exclude } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

/**
 * Import local objects
 */
import { Application } from '../../../application/application.entity';

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
@ObjectType()
@Schema(SchemaOptions)
export class BaseEntity {
  @Field(() => String, { nullable: false })
  @Transform((value) => (value?.value || value).toString(), {
    toPlainOnly: true,
  })
  readonly _id: string | Types.ObjectId;

  @Exclude()
  @Prop({ type: Types.ObjectId, ref: 'Application' })
  application?: Application;

  @Field(() => Date, { nullable: true })
  @Prop()
  timestamp?: Date;

  @Field(() => Date, { nullable: true })
  @Prop()
  edited_timestamp?: Date;

  @Exclude()
  @Prop()
  readonly __v?: number;
}
