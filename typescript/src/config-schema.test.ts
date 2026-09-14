import { describe, it, expect } from 'bun:test';
import './setup-bun-matchers';

describe('Base', () => {
  it('AllowEmptyConfigs', () => expect({}).toBeValidConfig());
  it('NoAdditionalProperties', () =>
    expect({ foo: 'bar' }).not.toBeValidConfig());
});

describe('Selector', () => {
  it('CanBeString', () => {
    expect({ selector: '.foo' }).toBeValidConfig();
  });

  it('CanBeStringArray', () => {
    expect({ selector: ['.foo'] }).toBeValidConfig();
  });

  it('CanBeSelectorWithSampleHTMLs', () => {
    expect({
      selector: {
        selector: 'some selector',
        sampleHTMLs: [],
      },
    }).toBeValidConfig();

    expect({
      selector: {
        selector: 'some selector',
        sampleHTMLs: ['tests/fixtures/sample.html'],
      },
    }).toBeValidConfig();

    expect({
      selector: {
        sampleHTMLs: [],
      },
    }).toBeValidConfig();

    expect({
      selector: {},
    }).toBeValidConfig();

    expect({
      selector: {
        selector: '.foo',
      },
    }).toBeValidConfig();
  });

  it('CanBeFullyEmpty', () => {
    expect({ selector: {} }).toBeValidConfig();
  });

  it('CannotBeEmpty', () => {
    expect({ selector: '' }).not.toBeValidConfig();
    expect({ selector: [] }).not.toBeValidConfig();
  });

  it('ForbidInvalidValues', () => {
    expect({ selector: 123 }).not.toBeValidConfig();
    expect({ selector: true }).not.toBeValidConfig();
  });
});

describe('String', () => {
  it('Selector', () => expect({ selector: '.foo' }).toBeValidConfig());
});

describe('Number', () => {
  it('Selector', () =>
    expect({ selector: '.foo', type: 'number' }).toBeValidConfig());

  it('AllowsTransform', () => {
    expect({
      selector: '.foo',
      type: 'number',
      transform: 'trim',
    }).toBeValidConfig();
  });

  it('CannotHaveProperties', () => {
    expect({
      selector: '.foo',
      type: 'number',
      properties: { foo: { selector: '.bar' } },
    }).not.toBeValidConfig();
  });

  it('CannotHaveItems', () => {
    expect({
      selector: '.foo',
      type: 'number',
      items: { selector: '.bar' },
    }).not.toBeValidConfig();
  });
});

describe('Boolean', () => {
  it('Selector', () =>
    expect({ selector: '.foo', type: 'boolean' }).toBeValidConfig());

  it('AllowsTransform', () => {
    expect({
      selector: '.foo',
      type: 'boolean',
      transform: 'trim',
    }).toBeValidConfig();
  });
});

describe('Object', () => {
  it('ImplyTypeToBeObjectWhenPropertiesPresent', () => {
    expect({
      selector: '.foo',
      properties: { foo: { selector: '.bar' } },
      type: 'object',
    }).toBeValidConfig();
    expect({
      selector: '.foo',
      properties: { foo: { selector: '.bar' } },
      type: 'string',
    }).not.toBeValidConfig();
  });

  it('PropertiesMustBeValidConfigs', () => {
    expect({ properties: { x: 123 } }).not.toBeValidConfig();
    expect({
      selector: '.ttt',
      properties: { x: { selector: '.foo' } },
    }).toBeValidConfig();
  });

  it('PropertiesMustBeDefinedWhenTypeIsObject', () => {
    expect({ selector: '.bar', type: 'object' }).not.toBeValidConfig();
  });

  it('CannotHaveTransform', () => {
    const conf = {
      selector: '.foo',
      properties: {
        x: { selector: '.x' },
      },
      transform: 'length',
    };

    expect(conf).not.toBeValidConfig();
  });
});

describe('Array', () => {
  it('ImplyTypeToBeArrayWhenItemsPresent', () => {
    expect({
      selector: '.foo',
      items: { selector: '.tt' },
      type: 'array',
    }).toBeValidConfig();

    expect({
      selector: '.foo',
      items: { selector: '.tt' },
      type: 'string',
    }).not.toBeValidConfig();
  });
});

describe('Union', () => {
  it('MustNotBeEmpty', () => {
    expect({ union: [] }).not.toBeValidConfig();
  });

  it('MustNotContainInvalidConfig', () => {
    expect({ union: [123] }).not.toBeValidConfig();
    expect({ union: [{ selector: 123 }] }).not.toBeValidConfig();
  });

  it('MustForbidAnyOtherProps', () => {
    expect({
      union: [{ selector: '.foo' }],
      selector: '.bar',
    }).not.toBeValidConfig();
  });
});

describe('Transform', () => {
  it('FailOnNonStringValues', () =>
    expect({ selector: '.foo', transform: 123 }).not.toBeValidConfig());

  it('ValidTransformer', () => {
    expect({ selector: '.foo', transform: 'length' }).toBeValidConfig();
  });

  it('AllowStringArray', () => {
    expect({
      selector: '.foo',
      transform: ['length', 'trim'],
    }).toBeValidConfig();
  });

  it('StringArrayCannotBeEmpty', () => {
    expect({ selector: '.foo', transform: [] }).not.toBeValidConfig();
  });
});

describe('Default', () => {
  it('AllowedOnPrimitive', () => {
    expect({ selector: '.foo', default: 'unknown' }).toBeValidConfig();
  });

  it('AllowsAnyValueType', () => {
    expect({ selector: '.foo', default: 0 }).toBeValidConfig();
    expect({ selector: '.foo', default: false }).toBeValidConfig();
    expect({ selector: '.foo', default: null }).toBeValidConfig();
    expect({ selector: '.foo', default: { foo: 'bar' } }).toBeValidConfig();
    expect({ selector: '.foo', default: ['foo'] }).toBeValidConfig();
  });

  it('AllowedOnObject', () => {
    expect({
      selector: '.foo',
      type: 'object',
      properties: { x: { selector: '.x' } },
      default: {},
    }).toBeValidConfig();
  });

  it('AllowedOnArray', () => {
    expect({
      selector: '.foo',
      items: { selector: '.tt' },
      default: [],
    }).toBeValidConfig();
  });

  it('AllowedOnUnion', () => {
    expect({
      union: [{ selector: '.foo' }],
      default: 'unknown',
    }).toBeValidConfig();
  });

  it('AllowedOnConstant', () => {
    expect({
      selector: '.foo',
      constant: 'bar',
      default: 'unknown',
    }).toBeValidConfig();
  });
});

describe('Constant', () => {
  it('String', () => {
    expect({ constant: 'foo' }).toBeValidConfig();
  });

  it('Number', () => {
    expect({ constant: 123 }).toBeValidConfig();
  });

  it('Boolean', () => {
    expect({ constant: true }).toBeValidConfig();
  });

  it('Object', () => {
    expect({ constant: { foo: 'bar' } }).toBeValidConfig();
  });

  it('Array', () => {
    expect({ constant: ['foo'] }).toBeValidConfig();
  });
});
