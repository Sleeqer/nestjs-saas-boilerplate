import { Entity as BaseEntity, Column, Index, ObjectIdColumn } from 'typeorm';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { ObjectID } from 'mongodb';

/**
 * Entity Class
 */
@Injectable()
@BaseEntity('entities')
@ObjectType()
export class Entity {
  /**
   * Id column
   */
  @ApiProperty({ type: 'string', required: false })
  @ObjectIdColumn()
  @Field(() => String)
  _id: number | string | ObjectID;

  /**
   * Title column
   */
  @ApiProperty({ required: true })
  @Index()
  @Column({ length: 255, unique: false, nullable: false })
  @Field({ nullable: false })
  title: string;

  /**
   * Description column
   */
  @ApiProperty({ required: false })
  @Column({ length: 512, unique: false, default: '' })
  @Field({ nullable: true })
  description: string = '';
}
