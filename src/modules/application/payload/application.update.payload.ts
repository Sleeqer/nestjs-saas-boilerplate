import { MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Import local objects
 */
import { ApplicationSettings } from '../application.entity';

/**
 * Application Update Payload Class
 */
export class ApplicationUpdatePayload {
  /**
   * Title field
   */
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  /**
   * Description field
   */
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MaxLength(512)
  description: string;

  /**
   * Settings field
   */
  @ApiProperty({
    required: false,
    default: new ApplicationSettings(),
  })
  @IsOptional()
  settings: ApplicationSettings;
}
