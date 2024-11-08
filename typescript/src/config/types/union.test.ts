import { cheerio } from '../..';
import UnionConfig from './union';
import ConfigWithSelector from './with-selector';

class FakeWithSelector extends ConfigWithSelector {
  constructor(
    readonly selector: ConfigWithSelector['selector'],
    private val: string
  ) {
    super();
  }

  extract() {
    return this.val;
  }
}

const html = `
<div id="foo">
  <span id="bar">
    baz
  </span>
</div>
`;

describe('UnionConfig', () => {
  it('ReturnSelf', () => {
    const $ = cheerio.load(html);
    const $el = $.root();
    const conf = UnionConfig.generate([
      new FakeWithSelector('#foo', 'first'),
      new FakeWithSelector(null, 'second'),
    ]);
    const $match = conf.extract({
      $,
      $el,
      url: 'https://example.com',
      property: '',
    });

    expect($match).toBe('first');
  });
});
