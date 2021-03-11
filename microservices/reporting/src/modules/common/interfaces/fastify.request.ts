import { FastifyRequest } from 'fastify';

/**
 * Fastify Request Interface
 */
export interface FastifyRequestInterface extends FastifyRequest {
  /**
   * Locals field
   */
  locals?: any;

  /**
   * User field
   */
  user?: any;
}
