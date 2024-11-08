import { Config, ExtractParams } from '../config';
import ConfigWithSelector from './with-selector';

export default class UnionConfig extends Config {
  private constructor(private readonly configs: Config[]) {
    super();
  }

  extract(params: ExtractParams) {
    const $parent = params.$el;

    for (const config of this.configs) {
      if (config instanceof ConfigWithSelector) {
        const $el = config.getFirstMatch($parent, {
          alreadyMatched: false,
          includeRoot: true,
        });

        if (!$el) {
          continue;
        }

        return config.extract({
          ...params,
          $el,
          elementAlreadyMatched: true,
        });
      } else {
        return config.extract({ ...params, $el: params.$el });
      }
    }

    return null;
  }

  static generate(configs: Config[]) {
    return new UnionConfig(configs);
  }
}
