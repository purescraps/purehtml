import { PureHTMLNode, PureHTMLNodeAttributes } from '../core/backend';
import { STRING } from '../core/primitive-types';
import { TransformParams, Transformer } from '../core/transformer';

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
    const node = $el.first();

    if (!node) {
      return null;
    }

    if (args.length === 0) {
      return node.attr();
    }

    if (args.length === 1) {
      return AttributeTransformer.getAttrValue(node, args[0]);
    }

    return args.reduce((acc, arg) => {
      acc[arg] = AttributeTransformer.getAttrValue(node, arg);

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
