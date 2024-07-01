import { PureHTMLDocument, PureHTMLMatches } from '../core/backend';
import { Property } from '../core/property';

export interface ExtractParams {
  $: PureHTMLDocument;
  $el: PureHTMLMatches;
  url: string;
  property: Property;
}

export abstract class Config<T = unknown> {
  abstract extract(params: ExtractParams): T;
}
