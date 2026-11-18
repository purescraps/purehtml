# frozen_string_literal: true

require_relative "../transformer"

module PureHTML
  module Transformers
    class ExistsTransformer < Transformer
      def self.transformer_name
        "exists"
      end

      def transform(params)
        !params.el.nil?
      end
    end
  end
end
