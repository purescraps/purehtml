import { PrimitiveTypes } from './primitive-types';

export abstract class Transformer {
  abstract getName(): string

  abstract inputType(): PrimitiveTypes

  abstract outputType(): PrimitiveTypes

  abstract transform(val: any, $el: cheerio.Cheerio): any
}

