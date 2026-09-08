import { type PrimitiveTypes, STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';
import { InvalidParseInputError } from '../errors/invalid-parse-input-error';

/**
 * capitalize: Uppercase the first character of a string and lowercase the
 * rest, e.g. "hELLO WORLD" -> "Hello world".
 */
export default class CapitalizeTransformer extends Transformer {
  static getName(): string {
    return 'capitalize';
  }

  inputType(): PrimitiveTypes {
    return STRING;
  }

  outputType(): PrimitiveTypes {
    return STRING;
  }

  transform({ property, val }: TransformParams) {
    if (val === null) {
      return null;
    }

    if (typeof val !== 'string') {
      throw new InvalidParseInputError(
        property,
        `CapitalizeTransformer.transform: invalid value type: ${typeof val}`,
      );
    }

    if (val.length === 0) {
      return val;
    }

    const lower = val.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
}
