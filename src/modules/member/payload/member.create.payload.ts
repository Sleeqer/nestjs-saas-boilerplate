import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  ArrayNotEmpty,
  ArrayMinSize,
  IsMongoId,
} from 'class-validator';

/**
 * Member Create Payload Class
 */
export class MemberCreatePayload {
  /**
   * Members field
   */
  @ApiProperty({
    required: true,
    type: () => [String],
  })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsMongoId({ each: true })
  readonly members: Set<String>;
}
