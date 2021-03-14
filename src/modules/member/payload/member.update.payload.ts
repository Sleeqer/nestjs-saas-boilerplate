import { MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Import local objects
 */
import { MemberSettings } from '../member.entity';

/**
 * Member Update Payload Class
 */
export class MemberUpdatePayload {
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

  /**
   * Settings field
   */
  @ApiProperty({
    required: false,
    default: new MemberSettings(),
  })
  @IsOptional()
  settings: MemberSettings;
}
