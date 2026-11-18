# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class ReplaceTransformer < Transformer
      def self.transformer_name
        "replace"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?

        unless val.is_a?(String)
          raise InvalidParseInputError.new("Replace: invalid value type: #{val.class}", property: params.property, value: val)
        end

        pattern, replacement = @args
        if pattern.nil? || replacement.nil?
          raise InvalidParseInputError.new('replace: requires a pattern and a replacement, e.g. replace("\\s+", " ")', property: params.property, value: val)
        end

        begin
          regex = Regexp.new(pattern)
          rep = replacement.gsub(/(?<!\\)\$(\d+)/, '\\\\\\1')
          val.gsub(regex, rep)
        rescue RegexpError
          val.gsub(pattern, replacement)
        end
      end
    end
  end
end
