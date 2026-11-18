# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class CapitalizeTransformer < Transformer
      def self.transformer_name
        "capitalize"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?

        unless val.is_a?(String)
          raise InvalidParseInputError.new("Capitalize: invalid value type: #{val.class}", property: params.property, value: val)
        end

        return val if val.empty?

        val.capitalize
      end
    end
  end
end
