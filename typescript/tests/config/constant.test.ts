import { ConfigFactory, cheerio } from '../../src';
import { rootProp } from '../../src/core/property';

const yaml = `
constant: foo
`;

describe('ConstantConfig', () => {
  const $ = cheerio.load(`<div>
    <span>experiment</span>
    <p>experiment</p>
  </div>`);

  it('basic', () => {
    const conf = ConfigFactory.fromYAML(yaml);
    const result = conf.extract({
      $,
      $el: $.root(),
      property: rootProp,
      url: 'https://example.com',
    });
    const expected = 'foo';

    expect(result).toBe(expected);
  });

  it('should return the given value if any of the nodes matches', () => {
    const conf = ConfigFactory.fromYAML(
      '{ selector: span, constant: { custom: "object" } }',
    );
    const result = conf.extract({
      $,
      $el: $.root(),
      property: rootProp,
      url: 'https://example.com',
    });
    const expected = { custom: 'object' };

    expect(result).toStrictEqual(expected);
  });

  it('should return null if nothing matches', () => {
    const conf = ConfigFactory.fromYAML(
      '{ selector: a, constant: { custom: "object" } }',
    );
    const result = conf.extract({
      $,
      $el: $.root(),
      property: rootProp,
      url: 'https://example.com',
    });

    expect(result).toBeNull();
  });
});
