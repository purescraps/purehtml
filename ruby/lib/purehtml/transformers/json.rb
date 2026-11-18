# frozen_string_literal: true

require "json"
require_relative "../transformer"

module PureHTML
  module Transformers
    class JsonTransformer < Transformer
      def self.transformer_name
        "json"
      end

      def transform(params)
        source = params.val
        source = params.el&.text if source.nil?
        return nil if source.nil?

        JSON.parse(source)
      end
    end
  end
end
