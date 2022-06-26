export const SELECTOR_SELF = '';

export abstract class Config {
  protected selector: string;

  abstract extract($: cheerio.Root, $parent:  cheerio.Cheerio): any

  protected getSelectorMatches($: cheerio.Cheerio): cheerio.Cheerio {
    if (this.selector === SELECTOR_SELF) {
      return $;
    }

    return $.find(this.selector);
  }
}
