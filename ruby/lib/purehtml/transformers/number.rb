# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class NumberTransformer < Transformer
      def self.transformer_name
        "number"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?
        return val if val.is_a?(Numeric)

        unless val.is_a?(String)
          raise InvalidParseInputError.new("NumberTransformer: invalid value type: #{val.class}", property: params.property, value: val)
        end

        s = val.strip
        if s =~ /\A-?\d+\z/
          s.to_i
        elsif s =~ /\A-?\d+(\.\d+)?([eE][+-]?\d+)?\z/
          s.to_f
        else
          begin
            Float(s)
          rescue ArgumentError
            raise InvalidParseInputError.new("NumberTransformer: not a valid number format: #{val.inspect}", property: params.property, value: val)
          end
        end
      end
    end
  end
end
