import assert from 'assert';
import { argTypeToStr } from '../core/argument-types';
import { Transformer } from '../core/transformer';
import { Transformers } from '../transformers';
import { Transform } from './primitive';

export class ConfigValidator {
  private readonly meta: {
    has: {
      items: boolean,
      properties: boolean,
      selector: boolean,
      type: boolean,
      transform: boolean,
    },
    expectedType: 'primitive' | 'array' | 'object',
    plain: any,
    path: string,
  };

  constructor(readonly plain: any, readonly path = '') {
    const has = {
      items: Object.prototype.hasOwnProperty.call(plain, 'items'),
      properties: Object.prototype.hasOwnProperty.call(plain, 'properties'),
      selector: Object.prototype.hasOwnProperty.call(plain, 'selector'),
      type: Object.prototype.hasOwnProperty.call(plain, 'type'),
      transform: Object.prototype.hasOwnProperty.call(plain, 'transform'),
    };

    this.meta = {
      has,
      expectedType: (plain.type === 'array' || has.items)
        ? 'array'
        : (plain.type === 'object' || has.properties)
          ? 'object'
          : 'primitive',
      plain,
      path,
    };
  }

  validate(path = this.meta.path) {
    this.validateSelector();
    this.validateTransform(path);
    this.validateProperties(path);
    this.validateItems(path);
    this.validateConfigProperties(path);
    this.validateType(path);
  }

  private validateSelector() {
    if (!this.meta.has.selector) {
      throw new Error(this.prefixPath(this.meta.path, '"selector" property cannot be undefined or empty'));
    }
  }

  private validateTransform(path: string) {
    if (!this.meta.has.transform) {
      return;
    }

    if (this.meta.expectedType === 'array' || this.meta.expectedType === 'object') {
      if (this.meta.expectedType === 'array') {
        if (this.meta.has.items) {
          throw new Error(this.prefixPath(path, 'Array cannot contain both "transform" and "items"'));
        }

        return
      }

      throw new Error(this.prefixPath(path, 'cannot pass "transform" for object and arrays'));
    }

    this.validateTransformer(this.meta.plain.transform, path);
  }

  private validateTransformer(transform: Transform, path: string) {
    if (typeof transform === "string") {
      const transformer = Transformers.getByName(transform);

      if (!transformer) {
        throw new Error(
          this.prefixPath(this.meta.path, `Transformer "${transform}" is not a valid transformer.`)
        )
      }

      return
    }

    if (Array.isArray(transform)) {
      return transform.forEach((tr, i) => this.validateTransformer(tr, (path || '.') + `[${i}]`))
    }

    throw new Error(this.prefixPath(path, `Unrecognized transformer type: "${typeof transform}".`))
  }

  private validateProperties(path: string) {
    if (!this.meta.has.properties) {
      return
    }

    const pairs = Object.entries(this.meta.plain.properties);

    for (const pair of pairs) {
      const [key, value] = pair;
      const validator = new ConfigValidator(value, `${path}.${key}`);

      validator.validate();
    }
  }

  private validateItems(path: string) {
    if (!this.meta.has.items) {
      return;
    }

    const validator = new ConfigValidator(this.meta.plain, `${path}.items`);

    validator.validate();
  }

  private validateType(path: string) {
    const meta = this.meta;
    const { expectedType } = meta;
    const type = meta.plain.type;
    const transformer = this.getTransformer();
    const typePath = `${path}.type`;

    if (!meta.has.type) {
      return;
    }

    if (meta.has.items) {
      assert(type === 'array', this.prefixPath(typePath, 'type must be "array"'));

      return;
    }

    if (meta.has.properties) {
      assert(type === 'object', this.prefixPath(typePath, 'type must be "object"'));

      return;
    }

    if (meta.has.transform && transformer && expectedType !== 'array') {
      const outputType = transformer.outputType()
      const outputTypeStr = argTypeToStr(outputType);

      assert(type === outputTypeStr, this.prefixPath(typePath, `type must match the transform output type. expected ${outputTypeStr}, got ${type}`));
    }
  }

  private validateConfigProperties(path: string) {
    const meta = this.meta;

    switch (meta.expectedType) {
      case 'object':
        if (meta.has.items) {
          throw new Error(this.prefixPath(path, 'objects cannot contain "items" property.'));
        }

        break;

      case 'array':
        if (meta.has.properties) {
          throw new Error(this.prefixPath(path, 'arrays cannot contain "properties" property.'));
        }

        if (meta.has.transform && meta.has.items) {
          throw new Error(this.prefixPath(path, 'arrays cannot contain "transform" and "items" together.'));
        }

        break;
    }
  }

  private getTransformer(): Transformer | undefined {
    const { transform } = this.meta.plain as { transform: Transform };

    if (!transform) {
      return
    }

    if (typeof transform === 'string') {
      return Transformers.getByName(transform);
    }

    if (Array.isArray(transform)) {
      if (transform.length === 0) {
        return;
      }

      const lastTransformer = transform[transform.length];

      if (typeof lastTransformer === 'string') {
        return Transformers.getByName(lastTransformer);
      }

      return lastTransformer;
    }

    return transform;
  }

  private assert(val: any, expected: string, path: string) {
    assert(val === expected, `${path} must be "${expected}" but got "${val}"`);
  }

  private prefixPath(path: string, message: string) {
    if (path) {
      return `${path}: ${message}`;
    }

    return message;
  }
}