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
    /**
     * Transform object
     * @param {any} document Document
     * @param {any} ret Retriever
     * @param {any} options Options
     * @returns
     */
    transform: function (document: any, ret: any, options: any) {
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
  /**
   * ID field
   */
  @Field(() => String, { nullable: false })
  @Transform((value) => (value?.value || value).toString(), {
    toPlainOnly: true,
  })
  readonly _id: string | Types.ObjectId;

  /**
   * Application field
   */
  @Exclude()
  @Prop({ type: Types.ObjectId, ref: 'Application' })
  application?: Application;

  /**
   * Timestamp field
   */
  @Field(() => Date, { nullable: true })
  @Prop()
  timestamp?: Date;

  /**
   * Edited timestamp field
   */
  @Field(() => Date, { nullable: true })
  @Prop()
  edited_timestamp?: Date;

  /**
   * Version field
   */
  @Exclude()
  @Prop()
  readonly __v?: number;
}
