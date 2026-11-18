# frozen_string_literal: true

require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class JoinTransformer < Transformer
      def self.transformer_name
        "join"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?

        unless val.is_a?(Array)
          raise InvalidParseInputError.new("Join: invalid value type: #{val.class}", property: params.property, value: val)
        end

        delimiter = @args[0] || ""
        val.map(&:to_s).join(delimiter)
      end
    end
  end
end
