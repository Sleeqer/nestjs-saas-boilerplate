import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  MaxLength,
  IsMongoId,
  IsString,
  IsNotEmpty,
} from 'class-validator';

/**
 * Import local objects
 */
import { Conversation } from '../../conversation/conversation.entity';
import { ReportReasonEnum } from '../enum/report.reason.enum';
import { User } from '../../user/user.entity';

/**
 * Report Create Payload Class
 */
export class ReportCreatePayload {
  /**
   * Title field
   */
  @ApiProperty({
    required: false,
    default: '',
  })
  @IsOptional()
  @MaxLength(255)
  readonly title: string;

  /**
   * Description field
   */
  @ApiProperty({
    required: false,
    default: '',
  })
  @IsOptional()
  @MaxLength(512)
  readonly description: string;

  /**
   * Reason field
   */
  @ApiProperty({
    required: true,
    default: ReportReasonEnum.OTHER,
  })
  @IsNotEmpty()
  @MaxLength(255)
  readonly reason: string;

  /**
   * Conversation field
   */
  @ApiProperty({
    required: false,
    default: null,
  })
  @IsString()
  @IsMongoId()
  @IsOptional()
  @Type(() => Conversation)
  readonly conversation: string;

  /**
   * User field
   */
  @ApiProperty({
    required: false,
    default: null,
  })
  @IsString()
  @IsMongoId()
  @IsOptional()
  @Type(() => User)
  readonly user: string;
}
