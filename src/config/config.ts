export abstract class Config {
  abstract extract($: cheerio.Root, $parent:  cheerio.Cheerio): any
}
