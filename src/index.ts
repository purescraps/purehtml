import { Config } from './config';
import { rootProp } from './core/property';
import { PureHTMLBackend, PureHTMLDocument } from './core/backend';
import { PureHTMLCheerioBackend } from './backends/cheerio';

const cheerio = new PureHTMLCheerioBackend();

export { ConfigFactory } from './config';

export { Config, cheerio };

export function extract<T = unknown>(
  backend: PureHTMLBackend,
  $: PureHTMLDocument | string,
  config: Config<T>,
  url: string
): T {
  let $root = $;

  if (typeof $root === 'string') {
    $root = backend.load($root);
  }

  return config.extract({
    $: $root,
    $el: $root.root(),
    property: rootProp,
    url,
  });
}
