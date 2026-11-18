# frozen_string_literal: true

require_relative "transformers/trim"
require_relative "transformers/number"
require_relative "transformers/attr"
require_relative "transformers/html"
require_relative "transformers/text"
require_relative "transformers/exists"
require_relative "transformers/length"
require_relative "transformers/json"
require_relative "transformers/jsonpath"
require_relative "transformers/resolve"
require_relative "transformers/url_query_param"
require_relative "transformers/remove_url_query_param"
require_relative "transformers/remove_last_path_section"
require_relative "transformers/replace"
require_relative "transformers/split"
require_relative "transformers/join"
require_relative "transformers/lower"
require_relative "transformers/upper"
require_relative "transformers/capitalize"
require_relative "transformers/boolean"

module PureHTML
  module Transformers
    REGISTRY = {
      "trim" => TrimTransformer,
      "number" => NumberTransformer,
      "attr" => AttrTransformer,
      "html" => HtmlTransformer,
      "text" => TextTransformer,
      "exists" => ExistsTransformer,
      "length" => LengthTransformer,
      "json" => JsonTransformer,
      "jsonpath" => JsonpathTransformer,
      "resolve" => ResolveTransformer,
      "urlQueryParam" => UrlQueryParamTransformer,
      "removeUrlQueryParam" => RemoveUrlQueryParamTransformer,
      "removeLastPathSection" => RemoveLastPathSectionTransformer,
      "replace" => ReplaceTransformer,
      "split" => SplitTransformer,
      "join" => JoinTransformer,
      "lower" => LowerTransformer,
      "upper" => UpperTransformer,
      "capitalize" => CapitalizeTransformer,
      "boolean" => BooleanTransformer
    }.freeze

    def self.get(name)
      REGISTRY[name]
    end
  end
end
