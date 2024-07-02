/**
 * PureHTML backend class
 */
export abstract class PureHTMLBackend {
  abstract load(html: Buffer | string): PureHTMLDocument;
}

export abstract class PureHTMLDocument {
  abstract root(): PureHTMLMatches;

  abstract $(selector: string): PureHTMLMatches;
}

export abstract class PureHTMLMatches {
  abstract length: number;

  abstract first(): PureHTMLNode | null;
  abstract find(selector: string): PureHTMLMatches;
  abstract html(): string | null;
  abstract is(selector: string): boolean;
  abstract text(): string;
  abstract map<T>(cb: (matches: PureHTMLMatches, index: number) => T): T[];
}

export type PureHTMLNodeAttributes = Record<string, string | null>;

export abstract class PureHTMLNode {
  abstract attr(name: string): string | null;
  abstract attr(): PureHTMLNodeAttributes;
}
