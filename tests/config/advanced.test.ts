import { ConfigFactory, cheerio } from '../../src';
import { rootProp } from '../../src/core/property';

const html = `<div>
  <div data-foo="foo"></div>
  <div data-bar="bar"></div>
  <div data-baz="baz"></div>
</div>`;

const yaml = `
selector: div[data-foo], div[data-bar], div[data-baz]
items:
  union:
    - selector: '[data-foo]'
      transform: attr(data-foo)
    - selector: '[data-bar]'
      transform: attr(data-bar)
    - selector: '[data-baz]'
      transform: attr(data-baz)
`;

describe('Advanced', () => {
  it('Basic', () => {
    const $ = cheerio.load(html);
    const conf = ConfigFactory.fromYAML(yaml);
    const result = conf.extract({
      $,
      $el: $.root(),
      property: rootProp,
      url: 'https://example.com',
    });

    expect(result).toStrictEqual(['foo', 'bar', 'baz']);
  });
});
