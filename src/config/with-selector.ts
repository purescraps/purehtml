import { Config } from './config';

export const SELECTOR_SELF = '';

export default abstract class ConfigWithSelector extends Config {
  protected selector: string;

  getSelector() {
    return this.selector;
  }

  protected getSelectorMatches($: cheerio.Cheerio): cheerio.Cheerio {
    if (this.selector === SELECTOR_SELF) {
      return $;
    }

    return $.find(this.selector);
  }
}
