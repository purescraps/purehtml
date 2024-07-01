/// <reference types="@types/cheerio/index.d.ts" />

import { load } from 'cheerio';
import {
  PureHTMLBackend,
  PureHTMLDocument,
  PureHTMLMatches,
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

  $(selector: string): PureHTMLMatches {
    return new PureHTMLCheerioMatches(this.#root, this.#root(selector));
  }

  root(): PureHTMLMatches {
    return new PureHTMLCheerioMatches(this.#root, this.#root.root());
  }
}

export class PureHTMLCheerioMatches extends PureHTMLMatches {
  #$: cheerio.Root;
  #el: cheerio.Cheerio;

  constructor($: cheerio.Root, el: cheerio.Cheerio) {
    super();

    this.#$ = $;
    this.#el = el;
  }

  override get length() {
    return this.#el.length;
  }

  override find(selector: string): PureHTMLMatches {
    return new PureHTMLCheerioMatches(this.#$, this.#el.find(selector));
  }

  override first(): PureHTMLNode {
    return new PureHTMLCheerioNode(this.#$, this.#el.first());
  }

  override html(): string | null {
    return this.#el.html();
  }

  override is(selector: string): boolean {
    return this.#el.is(selector);
  }

  override map<T>(cb: (matches: PureHTMLMatches, index: number) => T): T[] {
    return this.#el
      .toArray()
      .map((el, i) => cb(new PureHTMLCheerioMatches(this.#$, this.#$(el)), i));
  }

  override text(): string {
    return this.#el.text();
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
}
