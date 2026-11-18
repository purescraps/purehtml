# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class LengthTransformer < Transformer
      def self.transformer_name
        "length"
      end

      def transform(params)
        val = params.val
        if val.is_a?(String) || val.is_a?(Array)
          val.length
        else
          raise InvalidParseInputError.new("Length: invalid value type: #{val.class}", property: params.property, value: val)
        end
      end
    end
  end
end
