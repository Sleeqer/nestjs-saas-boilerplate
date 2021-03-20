import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';

/**
 * Import local objects
 */
import { MemberSettings } from '../member.entity';
import { AppRoles } from '../../app/app.roles';

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
