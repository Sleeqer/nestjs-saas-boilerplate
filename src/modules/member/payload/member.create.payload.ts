import { MinLength, IsOptional, IsEnum, ArrayUnique } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Import local objects
 */
import { RegisterPayload } from '../../authorization/payload/register.payload';
import { AppRoles } from 'src/modules/app/app.roles';

/**
 * Member Create Payload Class
 */
export class MemberCreatePayload extends RegisterPayload {
  /**
   * Password field
   */
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(6)
  readonly password: string;

  /**
   * Password field
   */
  @ApiProperty({
    required: false,
  })
  @ArrayUnique()
  @IsOptional()
  @IsEnum(AppRoles, { each: true })
  readonly roles: AppRoles;
}
