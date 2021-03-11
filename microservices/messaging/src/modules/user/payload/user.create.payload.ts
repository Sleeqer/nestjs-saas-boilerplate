import {
  IsNotEmpty,
  MinLength,
  IsOptional,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * User Create Payload Class
 */
export class UserCreatePayload {
  /**
   * Email field
   */
  @ApiProperty({
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  /**
   * First name field
   */
  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  first_name: string;

  /**
   * Last name field
   */
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  last_name: string;

  /**
   * Username field
   */
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  username: string;

  /**
   * Username field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MaxLength(255)
  sso: string;
}
