/// <reference types="@types/cheerio/index.d.ts" />

import { load } from 'cheerio';
import {
  PureHTMLBackend,
  PureHTMLDocument,
  PureHTMLNode,
  PureHTMLNodeAttributes,
} from '../core/backend';

export class PureHTMLCheerioBackend extends PureHTMLBackend {
  load(html: string | Buffer): PureHTMLCheerioDocument {
    return new PureHTMLCheerioDocument(load(html));
  }
}

export class PureHTMLCheerioDocument extends PureHTMLDocument {
  #root: cheerio.Root;

  constructor(root: cheerio.Root) {
    super();

    this.#root = root;
  }

  $(selector: string): PureHTMLCheerioNode[] {
    return this.#root(selector)
      .toArray()
      .map((el) => new PureHTMLCheerioNode(this.#root, this.#root(el)));
  }

  root(): PureHTMLCheerioNode {
    return new PureHTMLCheerioNode(this.#root, this.#root.root());
  }
}

export class PureHTMLCheerioNode extends PureHTMLNode {
  #$: cheerio.Root;
  #el: cheerio.Cheerio;

  constructor($: cheerio.Root, el: cheerio.Cheerio) {
    super();

    this.#$ = $;
    this.#el = el;
  }

  override attr(name: string): string | null;
  override attr(): PureHTMLNodeAttributes;
  override attr(name?: string): string | PureHTMLNodeAttributes | null {
    if (name) {
      return this.#el.attr(name) ?? null;
    }

    return this.#el.attr();
  }

  override find(selector: string): PureHTMLCheerioNode[] {
    return this.#el
      .find(selector)
      .toArray()
      .map((el) => new PureHTMLCheerioNode(this.#$, this.#$(el)));
  }

  override html(): string | null {
    return this.#el.html();
  }

  override is(selector: string): boolean {
    return this.#el.is(selector);
  }

  override text(): string {
    return this.#el.text();
  }
}
