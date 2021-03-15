import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * User Create Payload Class
 */
export class UserReplacePayload {
  /**
   * Id field
   */
  _id: number | string;

  /**
   * First name field
   */
  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  readonly first_name: string;

  /**
   * Last name field
   */
  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  readonly last_name: string;

  /**
   * Name field
   */
  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  readonly name: string;

  /**
   * Picture field
   */
  @ApiProperty({
    required: false,
    default: '',
  })
  @IsString()
  readonly picture: string;
}
