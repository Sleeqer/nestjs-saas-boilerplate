/**
 * RabbitMQ Exchange Interface
 */
export class RabbitMQExchangeInterface {
  /**
   * Title field
   */
  title: string = '';

  /**
   * Type field
   */
  type: string = 'direct';
}

/**
 * RabbitMQ Option Interface
 */
export interface RabbitMQOptionInterface {
  /**
   * Exchange field
   */
  exchange: RabbitMQExchangeInterface;

  /**
   * Key field
   */
  key: string;

  /**
   * Queue field
   */
  queue: string;
}

/**
 * RabbitMQ Enum
 */
export enum RabbitMQEnum {
  ACK = 'ack',
  NACK = 'nack',
}

/**
 * RabbitMQ Exchange Type Enum
 */
export enum RabbitMQExchangeTypeEnum {
  DIRECT = 'direct',
}

/**
 * RabbitMQ Response Type
 */
export type RabbitMQResponseType = RabbitMQEnum;
