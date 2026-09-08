import AttributeTransformer from './attr';
import BooleanTransformer from './boolean';
import CapitalizeTransformer from './capitalize';
import ExistsTransformer from './exists';
import HTMLTransformer from './html';
import JoinTransformer from './join';
import JSONTransformer from './json';
import LengthTransformer from './length';
import LowerTransformer from './lower';
import NumberTransformer from './number';
import { RemoveLastPathSection } from './remove-last-path-section';
import RemoveUrlQueryParam from './remove-url-query-param';
import ReplaceTransformer from './replace';
import ResolveTransformer from './resolve';
import SplitTransformer from './split';
import TrimTransformer from './trim';
import UpperTransformer from './upper';
import UrlQueryParamTransformer from './url-query-param';

export class Transformers {
  static readonly transformers = [
    AttributeTransformer,
    BooleanTransformer,
    CapitalizeTransformer,
    ExistsTransformer,
    HTMLTransformer,
    JoinTransformer,
    JSONTransformer,
    LengthTransformer,
    LowerTransformer,
    NumberTransformer,
    RemoveLastPathSection,
    RemoveUrlQueryParam,
    ReplaceTransformer,
    ResolveTransformer,
    SplitTransformer,
    TrimTransformer,
    UpperTransformer,
    UrlQueryParamTransformer,
  ];

  static getByName(name: string) {
    return Transformers.transformers.find((tr) => tr.getName() === name);
  }
}
