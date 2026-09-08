import type { ArgumentTypes } from './argument-types';
import type { PureHTMLNode } from './backend';
import type { Property } from './property';

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

  abstract inputType(): ArgumentTypes;

  abstract outputType(): ArgumentTypes;

  abstract transform(params: TransformParams): unknown;
}
