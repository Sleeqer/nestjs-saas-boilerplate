import { MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Application Update Payload Class
 */
export class ApplicationUpdatePayload {
  /**
   * Title field
   */
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  /**
   * Description field
   */
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(512)
  description: string;
}
