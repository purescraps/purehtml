# frozen_string_literal: true

require_relative "../transformer"

module PureHTML
  module Transformers
    class BooleanTransformer < Transformer
      def self.transformer_name
        "boolean"
      end

      def transform(params)
        val = params.val
        return false if val.nil?
        return false if val == false
        return false if val == 0 || val == 0.0
        return false if val == ""
        return false if val.is_a?(Array) && val.empty?
        return false if val.is_a?(Hash) && val.empty?

        true
      end
    end
  end
end
