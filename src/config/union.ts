import { Config } from './config';
import ConfigWithSelector from './with-selector';

export default class UnionConfig extends Config {
  private constructor(
    private readonly configs: ConfigWithSelector[]
  ) {
    super();
  }

  extract($: cheerio.Root, $parent: cheerio.Cheerio) {
    for (const config of this.configs) {
      const $el = $parent.find(config.getSelector())

      if ($el.length === 0) {
        continue;
      }

      return config.extract($, $el);
    }

    return null;
  }

  static generate(configs: []) {
    return new UnionConfig(configs);
  }
}
