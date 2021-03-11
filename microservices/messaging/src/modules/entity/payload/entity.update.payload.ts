import { IsNotEmpty, MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity Update Payload Class
 */
export class EntityUpdatePayload {
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
