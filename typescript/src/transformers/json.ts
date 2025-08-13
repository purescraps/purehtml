import { STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';

export default class JSONTransformer extends Transformer {
  static getName(): string {
    return 'json';
  }

  inputType(): typeof STRING {
    return STRING;
  }

  outputType(): typeof STRING {
    return STRING;
  }

  transform({ $el }: TransformParams): unknown | null {
    if (!$el) {
      return null;
    }

    return JSON.parse($el.text());
  }
}
