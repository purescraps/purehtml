import { type PrimitiveTypes, STRING } from '../core/primitive-types';
import { Transformer, type TransformParams } from '../core/transformer';

export class RemoveLastPathSection extends Transformer {
  static transformerName = 'removeLastPathSection';

  static getName(): string {
    return RemoveLastPathSection.transformerName;
  }

  inputType(): PrimitiveTypes {
    return STRING;
  }
  outputType(): PrimitiveTypes {
    return STRING;
  }

  transform({ val }: TransformParams): string | null {
    if (val === null) return null;

    if (typeof val !== 'string') {
      throw new Error(
        `${RemoveLastPathSection.transformerName}: expects string. Got ${JSON.stringify(
          val,
        )}`,
      );
    }

    const url = new URL(val);
    const sections = url.pathname.split('/');

    sections.pop();

    url.pathname = sections.join('/');

    return url.toString();
  }
}
