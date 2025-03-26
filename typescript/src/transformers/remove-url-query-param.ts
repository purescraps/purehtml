import { STRING } from '../core/primitive-types';
import { TransformParams, Transformer } from '../core/transformer';

/**
 * removeUrlQueryParam: Remove Query Paramters from the url
 * 
 * Usage:
 * removeUrlQueryParam(): the url will not be touched
 * removeUrlQueryParam(foo): only the `foo` query parameter will be removed
 * removeUrlQueryParam(foo, bar): query parameters `foo` and `bar` will be removed from the url
 */
export default class RemoveUrlQueryParam extends Transformer {
  static transformerName = 'removeUrlQueryParam'

  constructor(private readonly args: string[]) {
    super();
  }

  static getName(): string {
    return RemoveUrlQueryParam.transformerName;
  }

  inputType(): typeof STRING {
    return STRING;
  }

  outputType(): typeof STRING {
    return STRING;
  }

  transform({
    val,
  }: TransformParams): string | null | Record<string, string | null> {
    const { args } = this;

    if (typeof val !== 'string') {
      throw new Error(
        `${RemoveUrlQueryParam.transformerName}: expected string. Got ${JSON.stringify(
          val
        )}`
      );
    }

    // do not touch the url if no arguments given
    if (args.length === 0) return val; 

    const url = new URL(val);

    args.forEach(paramName => url.searchParams.delete(paramName))

    return url.toString()
  }
}
