import { IsNotEmpty, MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';

/**
 * Report Replace Payload Class
 */
export class ReportReplacePayload {
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
