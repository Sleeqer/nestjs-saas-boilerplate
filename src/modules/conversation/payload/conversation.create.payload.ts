import { IsNotEmpty, MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Conversation Create Payload Class
 */
export class ConversationCreatePayload {
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
    required: false,
  })
  @IsOptional()
  @MaxLength(512)
  description: string;
}
