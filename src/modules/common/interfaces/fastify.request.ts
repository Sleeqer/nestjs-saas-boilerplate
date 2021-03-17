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

  /**
   * Application
   */
  application?: any;

  /**
   * Member field
   */
  profile?: any;

  /**
 * Organization field
 */
  organization?: any;
}
