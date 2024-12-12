import AttributeTransformer from './attr';
import ExistsTransformer from './exists';
import HTMLTransformer from './html';
import JSONTransformer from './json';
import LengthTransformer from './length';
import NumberTransformer from './number';
import ResolveTransformer from './resolve';
import TrimTransformer from './trim';
import UrlQueryParamTransformer from './url-query-param';

export class Transformers {
  static readonly transformers = [
    AttributeTransformer,
    ExistsTransformer,
    HTMLTransformer,
    JSONTransformer,
    LengthTransformer,
    NumberTransformer,
    ResolveTransformer,
    TrimTransformer,
    UrlQueryParamTransformer,
  ];

  static getByName(name: string) {
    return this.transformers.find((tr) => tr.getName() === name);
  }
}
