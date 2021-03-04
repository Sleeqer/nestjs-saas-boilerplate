import { Entity as BaseEntity, Column, Index, ObjectIdColumn } from 'typeorm';
import { IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';

/**
 * Entity Class
 */
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
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  @Index()
  @Column({ length: 255, unique: false })
  title: string;

  /**
   * Description column
   */
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(512)
  @Column({ length: 512, unique: false })
  description: string;
}
