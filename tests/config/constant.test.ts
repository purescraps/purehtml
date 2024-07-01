import { ConfigFactory, cheerio } from '../../src';
import { rootProp } from '../../src/core/property';

const yaml = `
constant: foo
`;

describe('ConstantConfig', () => {
  it('Basic', () => {
    const $ = cheerio.load('');
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
});
