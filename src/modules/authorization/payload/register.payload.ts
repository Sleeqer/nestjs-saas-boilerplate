import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
} from 'class-validator';

/**
 * Register Payload Class
 */
export class RegisterPayload {
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
   * Password field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
