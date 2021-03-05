import { Entity as BaseEntity, Column, Index, ObjectIdColumn } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
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
  @ObjectIdColumn()
  _id: number | string | ObjectID;

  /**
   * Title column
   */
  @Index()
  @Column({ length: 255, unique: false })
  title: string;

  /**
   * Description column
   */
  @Column({ length: 512, unique: false })
  description: string;
}
