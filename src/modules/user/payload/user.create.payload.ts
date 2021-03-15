import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEmail,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * User Create Payload Class
 */
export class UserCreatePayload {
  /**
   * Id field
   */
  application: number | string;

  /**
   * Email field
   */
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  /**
   * First name field
   */
  @ApiProperty({
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  readonly first_name: string;

  /**
   * Last name field
   */
  @ApiProperty({
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  readonly last_name: string;

  /**
   * Name field
   */
  @ApiProperty({
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  readonly name: string;

  /**
   * Picture field
   */
  @ApiProperty({
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  readonly picture: string;

  /**
   * Username field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MaxLength(255)
  readonly sso: string;
}
