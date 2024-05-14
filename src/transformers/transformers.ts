import AttributeTransformer from './attr';
import ExistsTransformer from './exists';
import HTMLTransformer from './html';
import LengthTransformer from './length';
import MatchCountTransformer from './match-count';
import NumberTransformer from './number';
import ResolveTransformer from './resolve';
import TrimTransformer from './trim';
import UrlQueryParamTransformer from './url-query-param';

export class Transformers {
  static readonly transformers = [
    AttributeTransformer,
    ExistsTransformer,
    HTMLTransformer,
    LengthTransformer,
    MatchCountTransformer,
    NumberTransformer,
    ResolveTransformer,
    TrimTransformer,
    UrlQueryParamTransformer,
  ];

  static getByName(name: string) {
    return this.transformers.find((tr) => tr.getName() === name);
  }
}
