# frozen_string_literal: true

require_relative "../transformer"

module PureHTML
  module Transformers
    class HtmlTransformer < Transformer
      def self.transformer_name
        "html"
      end

      def transform(params)
        params.el&.html
      end
    end
  end
end
