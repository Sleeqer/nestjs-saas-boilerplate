import { IsNumber, IsObject, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Metadata Class
 */
export class Metadata {
  /**
   * Limit field
   */
  @ApiPropertyOptional({ default: 15 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(99)
  limit: number = 15;

  /**
   * Page field
   */
  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  /**
   * Total field
   */
  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  total: number = 0;

  /**
   * Key field
   */
  [key: string]: any;
}
