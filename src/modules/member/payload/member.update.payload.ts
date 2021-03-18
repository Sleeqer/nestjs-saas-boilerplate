import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayUnique,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';

/**
 * Import local objects
 */
import { AppRoles } from '../../app/app.roles';
import { MemberSettings } from '../member.entity';

/**
 * Member Update Payload Class
 */
export class MemberUpdatePayload {
  /**
   * Roles field
   */
  @ApiProperty({
    required: true,
    type: () => [String],
  })
  @IsOptional()
  @ArrayUnique()
  @IsEnum(AppRoles, { each: true })
  readonly roles: AppRoles;

  /**
   * Settings field
   */
  @ApiProperty({
    required: false,
    type: () => MemberSettings,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MemberSettings)
  readonly settings: MemberSettings;
}
