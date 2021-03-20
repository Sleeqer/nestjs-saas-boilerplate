/**
 * Import local objects
 */
import { GuardsPropertyObjectInterface } from '../../authorization/guards/decorators';
import { FastifyRequestInterface } from '../interfaces';

/**
 * Guardor Response Interface
 */
export interface GuardorResponse {
  /**
   * Parameters
   * @type {any}
   */
  parameters: any;

  /**
   * Field
   * @type {string}
   */
  field: string;

  /**
   * Context
   * @type {string}
   */
  context: string;
}

/**
 * Build a populate tree
 * @param {Array<string>} populate
 * @returns  {Array<object>}
 */
export const populate = (populate: Array<string>): Array<object> => {
  /**
   * Create a tree from dot notions
   * @param array
   */
  const tree = (array: Array<string>) =>
    array.reduce((trees: any, csv: any) => {
      csv
        .split('.')
        .reduce((obj: any, path: any) => (obj[path] = obj[path] || {}), trees);
      return trees;
    }, {});

  /**
   * Convert tree to parent children relations
   * @param {Array<string>} trees
   */
  const convert = (trees: Array<string>) =>
    Object.keys(trees).map((path) => {
      const object: any = { path };
      const populates = convert(trees[path]);
      if (populates.length) object.populate = populates;
      return object;
    });

  /**
   * Convertor
   */
  return convert(tree(populate));
};

/**
 * Guardor function
 * @param {any} evaluating Context
 * @param {GuardsPropertyObjectInterface} shield Shield
 * @param {FastifyRequestInterface} request Request
 * @returns {GuardorResponse}
 */
export const guardor = (
  evaluating: any,
  shield: GuardsPropertyObjectInterface,
  request: FastifyRequestInterface,
): GuardorResponse => {
  const current = shield?.guards
    ? evaluating instanceof (shield?.guards as Function)
    : undefined;

  const location: string = (current ? shield?.location : 'params') || 'params';
  const field: string = (current ? shield?.property : 'id') || 'id';
  const parameters: any = request[location];

  return {
    parameters,
    field,
    context: parameters[field],
  };
};

/**
 * Check if token is not expired
 * @param {any} decoded Decoded token
 * @returns {any} Initial decoded value
 */
export const alive = (decoded: any): any => {
  const now = Date.now().valueOf() / 1000;

  if (decoded?.exp && decoded.exp < now) throw new Error();
  if (decoded?.nbf && decoded.nbf > now) throw new Error();

  return decoded;
};
