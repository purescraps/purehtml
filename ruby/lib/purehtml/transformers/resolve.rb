# frozen_string_literal: true

require "uri"
require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class ResolveTransformer < Transformer
      def self.transformer_name
        "resolve"
      end

      def transform(params)
        val = params.val
        unless val.is_a?(String)
          raise InvalidParseInputError.new("Resolve: invalid value type: #{val.class}", property: params.property, value: val)
        end

        URI.join(params.url, val).to_s
      end
    end
  end
end
