/**
 * Message Handler Class
 */
export class EntityHandler {
  /**
   * @type {Function}
   */
  public handler: Function;

  /**
   * Constructor of Message Handler Class
   * @param {Function} handler Function to handler messages
   */
  constructor(handler: Function) {
    this.handler = handler;
  }
}
