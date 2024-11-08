import { PureHTMLCheerioBackend } from './backends/cheerio';
import { Config } from './config';
import { PureHTMLBackend, PureHTMLDocument } from './core/backend';
import { rootProp } from './core/property';

const cheerio = new PureHTMLCheerioBackend();

export { ConfigFactory } from './config';

/**
 * For custom html parsing backend implementors
 */
export {
  PureHTMLBackend,
  PureHTMLDocument,
  PureHTMLNode,
  PureHTMLNodeAttributes,
} from './core/backend';

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
