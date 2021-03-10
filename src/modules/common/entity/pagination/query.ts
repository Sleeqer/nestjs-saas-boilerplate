import { IsNumber, IsObject, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Query Class
 */
export class Query {
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
   * Order field
   */
  @ApiPropertyOptional({
    default: {
      id: 'DESC',
    },
  })
  @IsObject()
  order?: object = {
    id: 'DESC',
  };

  /**
   * Key field
   */
  [key: string]: any;
}
