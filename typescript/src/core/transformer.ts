import { PureHTMLNode } from './backend';
import { PrimitiveTypes } from './primitive-types';
import { Property } from './property';

export interface TransformParams {
  val: unknown;
  $el: PureHTMLNode | null;
  url: string;
  property: Property;
}

export abstract class Transformer {
  static getName(): string {
    throw new Error('Not implemented');
  }

  abstract inputType(): PrimitiveTypes;

  abstract outputType(): PrimitiveTypes;

  abstract transform(params: TransformParams): unknown;
}
