import { type PrimitiveTypes, STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';
import { InvalidParseInputError } from '../errors/invalid-parse-input-error';

export default class UpperTransformer extends Transformer {
  static getName(): string {
    return 'upper';
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

    if (typeof val === 'string') {
      return val.toUpperCase();
    }

    throw new InvalidParseInputError(
      property,
      `UpperTransformer.transform: invalid value type: ${typeof val}`,
    );
  }
}
