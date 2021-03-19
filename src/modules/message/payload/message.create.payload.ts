import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Message Create Payload Class
 */
export class MessageCreatePayload {
  /**
   * Content field
   */
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @MinLength(1)
  @MaxLength(1024)
  @IsNotEmpty()
  @IsString()
  readonly content: string = '';
}
