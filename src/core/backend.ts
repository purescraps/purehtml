/**
 * PureHTML backend class
 */
export abstract class PureHTMLBackend {
  abstract load(html: Buffer | string): PureHTMLDocument;
}

export abstract class PureHTMLDocument {
  abstract root(): PureHTMLNode;
  abstract $(selector: string): PureHTMLNode[];
}

export type PureHTMLNodeAttributes = Record<string, string | null>;

export abstract class PureHTMLNode {
  abstract attr(name: string): string | null;
  abstract attr(): PureHTMLNodeAttributes;
  abstract find(selector: string): PureHTMLNode[];
  abstract html(): string | null;
  abstract is(selector: string): boolean;
  abstract text(): string;
}
