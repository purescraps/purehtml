# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class SplitTransformer < Transformer
      def self.transformer_name
        "split"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?

        unless val.is_a?(String)
          raise InvalidParseInputError.new("Split: invalid value type: #{val.class}", property: params.property, value: val)
        end

        delimiter = @args[0]
        if delimiter.nil?
          trimmed = val.strip
          trimmed.empty? ? [] : trimmed.split(/\s+/)
        else
          val.split(delimiter, -1)
        end
      end
    end
  end
end
