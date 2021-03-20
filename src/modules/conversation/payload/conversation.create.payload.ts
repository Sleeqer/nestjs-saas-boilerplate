import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  IsOptional,
  MaxLength,
  ArrayUnique,
  IsMongoId,
} from 'class-validator';

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
  readonly title: string;

  /**
   * Description field
   */
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(512)
  readonly description: string = '';

  /**
   * Members field
   */
  @ApiProperty({
    required: false,
    type: () => [String],
    default: [],
  })
  @IsOptional()
  @ArrayUnique()
  @IsMongoId({ each: true })
  readonly members: Array<string> = [];
}
