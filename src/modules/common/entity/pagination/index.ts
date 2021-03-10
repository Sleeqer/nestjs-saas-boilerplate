import { ApiProperty } from '@nestjs/swagger';

/**
 * Import local objects
 */
import { EntityResultInterface } from './interface';
import { Metadata } from './metadata';

/**
 * Pagination Class
 */
export class Pagination<Entity> {
  /**
   * Results field
   */
  @ApiProperty({ type: [Object] })
  public results: Entity[];

  /**
   * Metadata field
   */
  @ApiProperty({ type: Metadata })
  public metadata: Metadata;

  /**
   * Constructor of Pagination Class
   * @param {EntityResultInterface<Entity>} data Entity result
   */
  constructor(data: EntityResultInterface<Entity> = { results: [], total: 0 }) {
    const { page, limit, total, results } = data;

    this.results = results;
    this.metadata = {
      page,
      limit,
      total,
    };
  }
}

/**
 * Exporting Query
 */
export * from './query';
