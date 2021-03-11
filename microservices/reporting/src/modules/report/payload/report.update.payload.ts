import { MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Report Update Payload Class
 */
export class ReportUpdatePayload {
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
