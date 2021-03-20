import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsEnum,
  ValidateNested,
  IsObject,
} from 'class-validator';

/**
 * Import local objects
 */
import { MemberSettings } from '../member.entity';
import { AppRoles } from '../../app/app.roles';

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
