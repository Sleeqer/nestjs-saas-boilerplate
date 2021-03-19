import { IsString, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Import local objects
 */
import { Query } from '../../common/entity/pagination';

/**
 * Query Class
 */
export class QueryPagination extends Query {
  /**
   * Before field
   */
  @ApiProperty({ default: undefined, required: false })
  @IsString()
  @IsOptional()
  @IsMongoId()
  @Type(() => String)
  before: string;

  /**
   * After field
   */
  @ApiProperty({ default: undefined, required: false })
  @IsString()
  @IsOptional()
  @IsMongoId()
  @Type(() => String)
  after: string;
}
