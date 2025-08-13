import type { PureHTMLNode, PureHTMLNodeAttributes } from '../core/backend';
import { STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';

export default class AttributeTransformer extends Transformer {
  constructor(private readonly args: string[]) {
    super();
  }

  static getName(): string {
    return 'attr';
  }

  inputType(): typeof STRING {
    return STRING;
  }

  outputType(): typeof STRING {
    return STRING;
  }

  transform({ $el }: TransformParams): PureHTMLNodeAttributes | string | null {
    const { args } = this;

    if (!$el) {
      return null;
    }

    if (args.length === 0) {
      return $el.attr();
    }

    if (args.length === 1) {
      return AttributeTransformer.getAttrValue($el, args[0]);
    }

    return args.reduce((acc, arg) => {
      acc[arg] = AttributeTransformer.getAttrValue($el, arg);

      return acc;
    }, {} as PureHTMLNodeAttributes);
  }

  private static getAttrValue($el: PureHTMLNode, attr: string): string | null {
    const val = $el.attr(attr);

    if (val === undefined) {
      return null;
    }

    return val;
  }
}
