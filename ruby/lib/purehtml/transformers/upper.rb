# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class UpperTransformer < Transformer
      def self.transformer_name
        "upper"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?

        unless val.is_a?(String)
          raise InvalidParseInputError.new("Upper: invalid value type: #{val.class}", property: params.property, value: val)
        end

        val.upcase
      end
    end
  end
end
