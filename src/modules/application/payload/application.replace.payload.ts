import { IsNotEmpty, MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

/**
 * Application Replace Payload Class
 */
export class ApplicationReplacePayload {
  /**
   * Id field
   */
  _id: number | string | Types.ObjectId;

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
