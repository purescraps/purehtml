import { Config, SELECTOR_SELF } from './config';
import { PrimitiveValueConfig, Transform } from './primitive';

export class ArrayConfig extends Config {
  transform?: Transform
  items?: Config

  private constructor() {
    super();
  }

  extract($: cheerio.Root, $parent:  cheerio.Cheerio) {
    const $el = this.getSelectorMatches($parent);
    let conf = this.items || PrimitiveValueConfig.generate(SELECTOR_SELF, this.transform);

    return $el
      .toArray()
      .map((el) => {
        return conf.extract($, $(el))
      });
  }

  static generate(selector: string, items?: ArrayConfig['items'], transform?: Transform): ArrayConfig {
    const conf = new ArrayConfig();

    conf.selector = selector;

    if (items) {
      conf.items = items;
    }

    if (transform) {
      conf.transform = transform;
    }

    return conf;
  }
}
