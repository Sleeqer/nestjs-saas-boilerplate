/**
 * Redis Subscribe Message Interface
 */
export interface RedisSubscribeMessageInterface {
  /**
   * Message field
   */
  readonly message: string;

  /**
   * Channel field
   */
  readonly channel: string;
}
