/**
 * Entity Result Interface
 */
export interface EntityResultInterface<Entity> {
  /**
   * Results field
   */
  results: Entity[];

  /**
   * Total field
   */
  total: number;

  /**
   * Page field
   */
  page?: number;

  /**
   * Limit field
   */
  limit?: number;

  /**
   * Next field
   */
  next?: string;

  /**
   * Previous field
   */
  previous?: string;
}
