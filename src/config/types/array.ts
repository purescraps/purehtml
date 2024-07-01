import { Property, rootProp } from '../../core/property';
import { Config, ExtractParams } from '../config';
import { PrimitiveValueConfig, Transform } from './primitive';
import ConfigWithSelector, {
  ConfigWithSelectorExtractParams,
} from './with-selector';

export class ArrayConfig extends ConfigWithSelector {
  static generate(
    selector: ConfigWithSelector['selector'],
    items?: ArrayConfig['items'],
    transform?: Transform
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
    const $el = this.getSelectorMatches(
      params.$el,
      params.elementAlreadyMatched ?? false
    );
    const conf =
      this.items || PrimitiveValueConfig.generate(null, this.transform);
    const extractOpts = { ...params } satisfies ExtractParams;

    const els = Array.isArray($el) ? $el : [$el];

    return els.map((el, i) => {
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
