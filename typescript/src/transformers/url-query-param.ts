import { STRING } from '../core/primitive-types';
import { type TransformParams, Transformer } from '../core/transformer';

export default class UrlQueryParamTransformer extends Transformer {
  constructor(private readonly args: string[]) {
    super();
  }

  static getName(): string {
    return 'urlQueryParam';
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
        `${UrlQueryParamTransformer.getName()}: expected string. Got ${JSON.stringify(
          val,
        )}`,
      );
    }

    const url = new URL(val);

    // return all the query params
    if (args.length === 0) {
      return Object.fromEntries(url.searchParams.entries());
    }

    if (args.length === 1) {
      // biome-ignore lint/style/noNonNullAssertion: already verified that args is not empty
      return url.searchParams.get(args[0]!);
    }

    return args.reduce(
      (acc, arg) => {
        acc[arg] = url.searchParams.get(arg);

        return acc;
      },
      {} as Record<string, string | null>,
    );
  }
}
