import { CanActivate, SetMetadata } from '@nestjs/common';

/**
 * Guards Property Object Interface
 */
export interface GuardsPropertyObjectInterface {
  /**
   * Property field
   */
  property?: string;

  /**
   * Location field
   */
  location?: string;

  /**
   * Guards field
   */
  guards: CanActivate | Function;
}

/**
 * Declare guard decorator
 * @param {GuardsPropertyObjectInterface} payload
 * @returns
 */
export const GuardsProperty = (payload: GuardsPropertyObjectInterface) => {
  const defaults = { guards: undefined, property: 'id', location: 'params' };
  return SetMetadata('guards.property', { ...defaults, ...payload });
};
