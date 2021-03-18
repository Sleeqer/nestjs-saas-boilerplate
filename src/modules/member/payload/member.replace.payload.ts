import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
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
 * Member Replace Payload Class
 */
export class MemberReplacePayload {
  /**
   * Roles field
   */
  @ApiProperty({
    required: true,
    type: () => [String],
  })
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(AppRoles, { each: true })
  readonly roles: AppRoles;

  /**
   * Settings field
   */
  @ApiProperty({
    required: true,
    type: () => MemberSettings,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => MemberSettings)
  readonly settings: MemberSettings;
}
