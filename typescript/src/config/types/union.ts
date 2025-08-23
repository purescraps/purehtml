import { Config, type ExtractParams } from '../config';
import ConfigWithSelector from './with-selector';

export default class UnionConfig extends Config {
  private constructor(private readonly configs: Config[]) {
    super();
  }

  extract(params: ExtractParams) {
    const $parent = params.$el;

    for (const config of this.configs) {
      if (config instanceof ConfigWithSelector) {
        const $matches = config.getAllMatches($parent, {
          alreadyMatched: false,
          includeRoot: true,
        });

        if (!$matches || (Array.isArray($matches) && $matches.length === 0))
          continue;

        return config.extract({
          ...params,
          $el: Array.isArray($matches)
            ? $matches.length > 1
              ? $parent
              : $matches[0]
            : $matches,

          // arrays must be matched again
          elementAlreadyMatched:
            !Array.isArray($matches) || $matches.length === 1,
        });
      }

      return config.extract({ ...params, $el: params.$el });
    }

    return null;
  }

  static generate(configs: Config[]) {
    return new UnionConfig(configs);
  }
}
