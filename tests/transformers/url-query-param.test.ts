import { ConfigFactory, cheerio } from '../../src';
import { ExtractParams } from '../../src/config';
import { PureHTMLDocument, PureHTMLMatches } from '../../src/core/backend';
import { rootProp } from '../../src/core/property';

const SAMPLE = `
  <div id="main">
    <a id="link1" href="https://google.com/search?q=Typescript&clientId=abc">Search Typescript on Google</a>
    <a id="linkddg" href="https://duckduckgo.com/search?q=Typescript&from=searchBar">Search Typescript on DuckDuckGo</a>
  </div>

  <div id="other">
    <a id="otherlink1" href="https://example.com/some/page">URL without any query params.</a>
  </div>
`;

describe('UrlQueryParamTransformer', () => {
  let $: PureHTMLDocument, $el: PureHTMLMatches;
  let extractParams: ExtractParams;

  beforeAll(() => {
    $ = cheerio.load(SAMPLE);
    $el = $.root();
    extractParams = {
      $,
      $el,
      url: 'https://example.com',
      property: rootProp,
    };
  });

  it('should return all query params as objects', () => {
    const yaml = `
selector: '#main a'
items:
  transform: [attr(href), urlQueryParam]`;
    const conf = ConfigFactory.fromYAML(yaml);
    const result = conf.extract(extractParams);
    const expected = [
      { clientId: 'abc', q: 'Typescript' }, // google
      { from: 'searchBar', q: 'Typescript' }, // duckduckgo
    ];

    expect(result).toStrictEqual(expected);
  });

  // lookup for the q parameter in the search engine links
  it('should return individual query parameter values', () => {
    const yaml = `
selector: '#main a'
items:
  transform: [attr(href), urlQueryParam(q)]`;
    const conf = ConfigFactory.fromYAML(yaml);
    const result = conf.extract(extractParams);
    const expected = [
      'Typescript', // google
      'Typescript', // duckduckgo
    ];

    expect(result).toStrictEqual(expected);
  });

  // lookup for clientId parameter in duckduckgo link
  it('should return null if the parameter was not found', () => {
    const yaml = `
selector: '#linkddg'
transform: [attr(href), urlQueryParam(clientId)]`;
    const conf = ConfigFactory.fromYAML(yaml);
    const result = conf.extract(extractParams);
    const expected = null;

    expect(result).toStrictEqual(expected);
  });

  it('should return an empty object if no query params found', () => {
    const yaml = `
selector: '#otherlink1'
transform: [attr(href), urlQueryParam]`;
    const conf = ConfigFactory.fromYAML(yaml);
    const result = conf.extract(extractParams);
    const expected = {};

    expect(result).toStrictEqual(expected);
  });
});
