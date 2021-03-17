import { IsNotEmpty, MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';

/**
 * Profile Create Payload Class
 */
export class ProfileReplacePayload {
  /**
   * Id field
   */
  _id: number | string | ObjectID;

  /**
   * Title field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  /**
   * Description field
   */
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @MaxLength(512)
  description: string;
}
