/**
 * Import local objects
 */
import { EntityResultInterface } from './interface';

/**
 * Pagination Class
 */
export class Pagination<Entity> {
  /**
   * Results field
   */
  public results: Entity[];

  /**
   * Metadata field
   */
  public metadata: object;

  /**
   * Constructor of Pagination Class
   * @param {EntityResultInterface<Entity>} data Entity result
   */
  constructor(data: EntityResultInterface<Entity>) {
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
