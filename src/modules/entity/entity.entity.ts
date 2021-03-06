import { Entity as BaseEntity, Column, Index, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { ObjectID } from 'mongodb';

/**
 * Entity Class
 */
@Injectable()
@BaseEntity('entities')
export class Entity {
  /**
   * Id column
   */
  @ApiProperty({ type: 'string' })
  @ObjectIdColumn()
  _id: number | string | ObjectID;

  /**
   * Title column
   */
  @ApiProperty()
  @Index()
  @Column({ length: 255, unique: false })
  title: string;

  /**
   * Description column
   */
  @ApiProperty()
  @Column({ length: 512, unique: false })
  description: string;
}
