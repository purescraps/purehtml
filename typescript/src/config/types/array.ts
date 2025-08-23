import { type Property, rootProp } from '../../core/property';
import type { Config, ExtractParams } from '../config';
import { PrimitiveValueConfig, type Transform } from './primitive';
import ConfigWithSelector, {
  type ConfigWithSelectorExtractParams,
} from './with-selector';

export class ArrayConfig extends ConfigWithSelector {
  static generate(
    selector: ConfigWithSelector['selector'],
    items?: ArrayConfig['items'],
    transform?: Transform,
  ): ArrayConfig {
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

  transform?: Transform;
  items?: Config;

  private constructor() {
    super();
  }

  extract(params: ConfigWithSelectorExtractParams): unknown {
    const $el = this.getAllMatches(params.$el, {
      alreadyMatched: params.elementAlreadyMatched ?? false,
      includeRoot: false,
    });
    const matches = Array.isArray($el) ? $el : [$el];
    const conf =
      this.items || PrimitiveValueConfig.generate(null, this.transform);
    const extractOpts = { ...params } satisfies ExtractParams;

    return matches.map((el, i) => {
      return conf.extract({
        ...extractOpts,
        $el: el,
        property: this.makeProperty(params.property, i),
      });
    });
  }

  private makeProperty(property: Property, index: number): Property {
    if (property === rootProp) {
      return `[${index}]`;
    }

    return `${property}[${index}]`;
  }
}
