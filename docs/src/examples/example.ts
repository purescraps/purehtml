export interface Example {
  name: string;
  html: string;
  /** Large documents are fetched from this URL instead of being inlined. */
  htmlUrl?: string;
  config: string;
  url?: string;
}
