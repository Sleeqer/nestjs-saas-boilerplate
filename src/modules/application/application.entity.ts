import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Exclude } from 'class-transformer';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Import local objects
 */
import { BaseEntity, SchemaOptions } from '../common/entity/entity';

/**
 * Application Document
 */
export type ApplicationDocument = Application & Document;

/**
 * Application Settings Token Class
 */
@ObjectType()
export class ApplicationSettingsToken {
  /**
   * Secret field
   */
  @ApiProperty({ required: false, default: '' })
  @Field(() => String)
  @Prop({ required: false, default: '' })
  secret: string = '';

  /**
   * Property field
   */
  @ApiProperty({ required: false, default: '' })
  @Field(() => String)
  @Prop({ required: false, default: '_id' })
  property: string = '_id';
}

/**
 * Application Settings Class
 */
@ObjectType()
export class ApplicationSettings {
  /**
   * Token field
   */
  @ApiProperty({
    required: true,
  })
  @Field(() => ApplicationSettingsToken)
  @Prop({
    required: false,
  })
  token: ApplicationSettingsToken = new ApplicationSettingsToken();
}

/**
 * Application Schema
 */
@ObjectType()
@Schema(SchemaOptions)
export class Application {
  /**
   * ID field
   */
  @Field(() => String, { nullable: false })
  @Transform((value) => (value?.value || value).toString(), {
    toPlainOnly: true,
  })
  readonly _id: string;

  /**
   * Title field
   */
  @Field(() => String)
  @Prop({ required: true })
  title: string;

  /**
   * Description field
   */
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  description: string;

  /**
   * Settings field
   */
  @Field(() => ApplicationSettings)
  @Prop({ required: false, default: new ApplicationSettings() })
  settings?: ApplicationSettings;

  /**
   * Key field
   */
  @Field(() => String)
  @Prop()
  key?: string;

  /**
   * Organization field
   */
  @Field(() => String)
  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organization?: BaseEntity;

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
