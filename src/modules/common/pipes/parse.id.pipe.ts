import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

/**
 * Parse Id Pipe Options Interface
 */
export interface ParseIdPipeOptions {
  /**
   * Check whenever parse should be strict
   * @type {boolean}
   */
  strict: boolean;
}

/**
 * Parse Id Pipe Class
 */
export class ParseIdPipe
  implements PipeTransform<any, number | string | ObjectId> {
  /**
   * Options of Parse Id Pipe Class
   */
  options?: ParseIdPipeOptions;

  /**
   * Constructor of Parse Id Pipe Class
   * @param {ParseIdPipeOptions} options Pipe options
   */
  constructor(options: ParseIdPipeOptions = { strict: true }) {
    this.options = options;
  }

  /**
   * Transformer
   * @param {any} value Evaluating
   * @returns {number | string | ObjectID} Value
   */
  transform(value: any): number | string | ObjectId {
    /**
     * Phase one , validate only object id type
     */
    try {
      value = new ObjectId(value);

      return value;
    } catch (error) {
      if (this.options.strict) throw new BadRequestException(error.message);
    }

    /**
     * Phase two , validate
     */
    const numeric =
      ['string', 'number'].includes(typeof value) &&
      !isNaN(parseFloat(value)) &&
      isFinite(value);

    if (!numeric)
      throw new BadRequestException(
        'Id validation failed (numeric value is expected)',
      );

    return parseInt(value, 10);
  }
}
