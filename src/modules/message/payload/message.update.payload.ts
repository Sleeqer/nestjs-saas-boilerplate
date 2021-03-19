import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Message Update Payload Class
 */
export class MessageUpdatePayload {
  /**
   * Content field
   */
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @MinLength(1)
  @MaxLength(1024)
  @IsOptional()
  @IsString()
  readonly content: string;
}
