import type { ExtractParams } from '../config';
import ConfigWithSelector from './with-selector';

export default class ConstantConfig extends ConfigWithSelector {
  private constructor(
    private readonly val: unknown,
    selector: string | null,
  ) {
    super();
    this.selector = selector;
  }

  extract(params: ExtractParams) {
    if (this.selector) {
      const matches = this.getAllMatches(params.$el, {
        alreadyMatched: false,
        includeRoot: true,
      });

      if (Array.isArray(matches) && matches.length === 0) {
        return null;
      }

      return this.val;
    }
    return this.val;
  }

  static generate(val: unknown, selector: string | null) {
    return new ConstantConfig(val, selector);
  }
}
