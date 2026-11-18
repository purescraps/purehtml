# frozen_string_literal: true

require_relative "../transformer"

module PureHTML
  module Transformers
    class TextTransformer < Transformer
      def self.transformer_name
        "text"
      end

      def transform(params)
        params.el&.text
      end
    end
  end
end
