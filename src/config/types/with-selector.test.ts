import { load } from "cheerio";
import ConfigWithSelector, { ConfigWithSelectorExtractParams } from "./with-selector";

class FakeWithSelector extends ConfigWithSelector {
  constructor(selector: ConfigWithSelector['selector']) {
    super();

    this.selector = selector;
  }

  extract(_$: cheerio.Root, _$el: cheerio.Cheerio, _opts?: ConfigWithSelectorExtractParams) {
    return '';
  }
}

const html = `
<div id="foo">
  <span id="bar">
    baz
  </span>
</div>
`;

describe('ConfigWithSelector', () => {
  it('ReturnSelf', () => {
    const $ = load(html);
    const $el = $.root();
    const conf = new FakeWithSelector(null);
    const $match = conf.getSelectorMatches($el, false);
    const expected = $el;

    expect($match).toBe(expected);
  });
});
