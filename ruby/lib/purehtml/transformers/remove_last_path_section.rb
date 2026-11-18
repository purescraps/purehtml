# frozen_string_literal: true

require "uri"
require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class RemoveLastPathSectionTransformer < Transformer
      def self.transformer_name
        "removeLastPathSection"
      end

      def transform(params)
        val = params.val
        return nil if val.nil?

        unless val.is_a?(String)
          raise InvalidParseInputError.new("removeLastPathSection: expected string. Got #{val.class}", property: params.property, value: val)
        end

        uri = URI.parse(val)
        path = uri.path
        if path.nil? || path.empty? || path == "/"
          uri.path = "/"
          return uri.to_s
        end

        path = path[0...-1] if path.end_with?("/") && path.length > 1
        idx = path.rindex("/")
        if idx.nil? || idx == 0
          uri.path = "/"
        else
          uri.path = path[0...idx]
        end
        uri.to_s
      end
    end
  end
end
