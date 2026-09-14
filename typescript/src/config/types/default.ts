import { Config, type ExtractParams } from '../config';

/**
 * Wraps another config and substitutes a fallback value whenever the wrapped
 * config's extraction result is `null` (a non-matching selector, an empty
 * union, etc.). This is what powers the per-field `default: <value>` config
 * option, and applies uniformly regardless of the wrapped config's type.
 */
export default class DefaultValueConfig<T = unknown> extends Config<T> {
  private constructor(
    private readonly inner: Config,
    private readonly defaultValue: T,
  ) {
    super();
  }

  extract(params: ExtractParams): T {
    const val = this.inner.extract(params);

    return (val === null ? this.defaultValue : val) as T;
  }

  static generate<T>(inner: Config, defaultValue: T): DefaultValueConfig<T> {
    return new DefaultValueConfig(inner, defaultValue);
  }
}
