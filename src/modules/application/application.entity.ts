import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
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
 * Application Settings Token Class
 */
@ObjectType()
export class ApplicationSettingsToken {
  @ApiProperty({ required: false, default: '' })
  @Field(() => String)
  @Prop({ required: false, default: '' })
  secret: string = '';

  @ApiProperty({ required: false, default: '' })
  @Field(() => String)
  @Prop({ required: false, default: '' })
  property: string = '';
}

/**
 * Application Settings Class
 */
@ObjectType()
export class ApplicationSettings {
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
export class Application extends BaseEntity {
  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => ApplicationSettings)
  @Prop({ required: false, default: new ApplicationSettings() })
  settings?: ApplicationSettings;

  @Field(() => String)
  @Prop()
  key?: string;

  @Field(() => String)
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
