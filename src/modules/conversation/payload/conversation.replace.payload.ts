import { IsNotEmpty, MinLength, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';

/**
 * Conversation Create Payload Class
 */
export class ConversationReplacePayload {
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
    default: '',
  })
  @IsString()
  @MaxLength(512)
  description: string;
}
