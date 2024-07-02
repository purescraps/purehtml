import { PureHTMLNode } from '../../core/backend';
import { Config, ExtractParams } from '../config';

export interface ConfigWithSelectorExtractParams extends ExtractParams {
  elementAlreadyMatched?: boolean;
}

export interface GetSelectorMatchesParams {
  alreadyMatched: boolean;
  includeRoot: boolean;
}

export default abstract class ConfigWithSelector extends Config {
  protected selector: string | null = null;

  abstract extract(params: ConfigWithSelectorExtractParams): unknown;

  getAllMatches(
    $: PureHTMLNode,
    { alreadyMatched, includeRoot }: GetSelectorMatchesParams
  ): PureHTMLNode | PureHTMLNode[] {
    if (alreadyMatched) {
      return $;
    }

    if (this.selector === null) {
      return $;
    }

    // check if the element *itself* matches the given selector
    if (includeRoot && $.is(this.selector)) {
      return $;
    }

    return $.find(this.selector) ?? null;
  }

  getFirstMatch(
    $: PureHTMLNode,
    params: GetSelectorMatchesParams
  ): PureHTMLNode | null {
    const matches = this.getAllMatches($, params);

    if (Array.isArray(matches)) {
      return matches[0] ?? null;
    }

    return matches;
  }
}
