import { ARRAY } from '../core/complex-types';
import { STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';
import { InvalidParseInputError } from '../errors/invalid-parse-input-error';

/**
 * join: Join an array into a string
 *
 * Usage:
 * join(): joins with an empty string
 * join(delimiter): joins array elements using `delimiter`
 */
export default class JoinTransformer extends Transformer {
  constructor(private readonly args: string[]) {
    super();
  }

  static getName(): string {
    return 'join';
  }

  inputType(): typeof ARRAY {
    return ARRAY;
  }

  outputType(): typeof STRING {
    return STRING;
  }

  transform({ property, val }: TransformParams) {
    if (val === null) {
      return null;
    }

    if (!Array.isArray(val)) {
      throw new InvalidParseInputError(
        property,
        `JoinTransformer.transform: invalid value type: ${typeof val}`,
      );
    }

    const [delimiter = ''] = this.args;

    return val.map((item) => String(item)).join(delimiter);
  }
}
