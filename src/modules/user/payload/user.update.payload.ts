import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * User Update Payload Class
 */
export class UserUpdatePayload {
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
}
