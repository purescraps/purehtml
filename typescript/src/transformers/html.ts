import { type PrimitiveTypes, STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';

export default class HTMLTransformer extends Transformer {
  static getName(): string {
    return 'html';
  }

  inputType(): PrimitiveTypes {
    return STRING;
  }

  outputType(): PrimitiveTypes {
    return STRING;
  }

  transform({ $el }: TransformParams) {
    return $el?.html();
  }
}
