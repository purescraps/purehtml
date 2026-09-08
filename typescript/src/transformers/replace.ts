import { type PrimitiveTypes, STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';
import { InvalidParseInputError } from '../errors/invalid-parse-input-error';

/**
 * replace: Replace regex/string matches in a string
 *
 * Usage:
 * replace(pattern, replacement): replaces every match of `pattern` (a
 * regular expression) with `replacement`. `replacement` may reference
 * capture groups using $1, $2, etc.
 */
export default class ReplaceTransformer extends Transformer {
  constructor(private readonly args: string[]) {
    super();
  }

  static getName(): string {
    return 'replace';
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
        `ReplaceTransformer.transform: invalid value type: ${typeof val}`,
      );
    }

    const [pattern, replacement] = this.args;

    if (pattern === undefined || replacement === undefined) {
      throw new Error(
        'replace: requires a pattern and a replacement, e.g. replace("\\s+", " ")',
      );
    }

    return val.replace(new RegExp(pattern, 'g'), replacement);
  }
}
