import { parse } from 'yaml';
import { ArrayConfig } from './array';
import { Config } from './config';
import { ObjectConfig } from './object';
import { PrimitiveValueConfig } from './primitive';
import { ConfigValidator } from './validator';

export class ConfigFactory {
  static fromYAML(yaml: string): Config {
    const plain = parse(yaml);

    return this.generate(plain);
  }

  private static generate(plain: any): Config {
    const validator = new ConfigValidator(plain);

    validator.validate();

    const {
      selector,
      type,
      transform,
      properties,
      items,
    } = plain;

    const expectedType =
      properties || type === 'object'
      ? 'object'
      : items || type === 'array'
        ? 'array'
        : 'primitive';

    switch (expectedType) {
      case 'object':
        let propConfigs: ObjectConfig['properties'] | undefined = undefined;

        if (properties) {
          propConfigs = Object.keys(properties).reduce((acc, key) => {
            acc[key] = this.generate(properties[key]);

            return acc;
          }, {});
        }

        return ObjectConfig.generate(selector, propConfigs);
      case 'array':
        return ArrayConfig.generate(selector, items, transform);
      default:
        return PrimitiveValueConfig.generate(selector, transform);
    }
  }
}
