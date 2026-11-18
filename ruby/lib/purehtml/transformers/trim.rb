# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class TrimTransformer < Transformer
      def self.transformer_name
        "trim"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?

        raise InvalidParseInputError.new("Trim: invalid value type: #{val.class}", property: params.property, value: val) unless val.is_a?(String)

        val.strip
      end
    end
  end
end
