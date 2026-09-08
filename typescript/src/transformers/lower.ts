import { type PrimitiveTypes, STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';
import { InvalidParseInputError } from '../errors/invalid-parse-input-error';

export default class LowerTransformer extends Transformer {
  static getName(): string {
    return 'lower';
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
      return val.toLowerCase();
    }

    throw new InvalidParseInputError(
      property,
      `LowerTransformer.transform: invalid value type: ${typeof val}`,
    );
  }
}
