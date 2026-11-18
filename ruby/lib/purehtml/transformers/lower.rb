# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class LowerTransformer < Transformer
      def self.transformer_name
        "lower"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?

        unless val.is_a?(String)
          raise InvalidParseInputError.new("Lower: invalid value type: #{val.class}", property: params.property, value: val)
        end

        val.downcase
      end
    end
  end
end
