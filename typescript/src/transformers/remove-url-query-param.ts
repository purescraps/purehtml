import { STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';

/**
 * removeUrlQueryParam: Remove Query Paramters from the url
 *
 * Usage:
 * removeUrlQueryParam(): the url will not be touched
 * removeUrlQueryParam(foo): only the `foo` query parameter will be removed
 * removeUrlQueryParam(foo, bar): query parameters `foo` and `bar` will be removed from the url
 */
export default class RemoveUrlQueryParam extends Transformer {
  static transformerName = 'removeUrlQueryParam';

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
          val,
        )}`,
      );
    }

    const url = new URL(val);

    // clear all the search params if no arguments are given
    if (args.length === 0) {
      const keys = Array.from(url.searchParams.keys());

      keys.forEach((key) => {
        url.searchParams.delete(key);
      });
    } else {
      for (const paramName of args) {
        url.searchParams.delete(paramName);
      }
    }

    return url.toString();
  }
}
