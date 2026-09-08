import { ARRAY } from '../core/complex-types';
import { STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';
import { InvalidParseInputError } from '../errors/invalid-parse-input-error';

/**
 * split: Split a string into an array
 *
 * Usage:
 * split(): splits on runs of whitespace, like Python's str.split()
 * split(delimiter): splits on the literal `delimiter` string
 */
export default class SplitTransformer extends Transformer {
  constructor(private readonly args: string[]) {
    super();
  }

  static getName(): string {
    return 'split';
  }

  inputType(): typeof STRING {
    return STRING;
  }

  outputType(): typeof ARRAY {
    return ARRAY;
  }

  transform({ property, val }: TransformParams) {
    if (val === null) {
      return null;
    }

    if (typeof val !== 'string') {
      throw new InvalidParseInputError(
        property,
        `SplitTransformer.transform: invalid value type: ${typeof val}`,
      );
    }

    const [delimiter] = this.args;

    if (delimiter === undefined) {
      const trimmed = val.trim();
      return trimmed === '' ? [] : trimmed.split(/\s+/);
    }

    return val.split(delimiter);
  }
}
