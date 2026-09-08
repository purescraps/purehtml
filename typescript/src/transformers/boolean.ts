import { BOOLEAN, type PrimitiveTypes } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';

/**
 * boolean: Explicitly cast any value to a boolean using truthy semantics.
 *
 * Unlike `exists` (which reports whether an element/attribute is present),
 * `boolean` casts the value itself: "", 0, null/undefined, and empty
 * arrays/objects are false; everything else is true.
 */
export default class BooleanTransformer extends Transformer {
  static getName(): string {
    return 'boolean';
  }

  inputType(): PrimitiveTypes {
    return BOOLEAN;
  }

  outputType(): PrimitiveTypes {
    return BOOLEAN;
  }

  transform({ val }: TransformParams) {
    if (Array.isArray(val)) {
      return val.length > 0;
    }

    if (val !== null && typeof val === 'object') {
      return Object.keys(val).length > 0;
    }

    return Boolean(val);
  }
}
