# frozen_string_literal: true

require "uri"
require "set"
require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class RemoveUrlQueryParamTransformer < Transformer
      def self.transformer_name
        "removeUrlQueryParam"
      end

      def transform(params)
        val = params.val
        unless val.is_a?(String)
          raise InvalidParseInputError.new("removeUrlQueryParam: expected string. Got #{val.class}", property: params.property, value: val)
        end

        uri = URI.parse(val)
        return val unless uri.query

        if @args.empty?
          uri.query = nil
        else
          remove_set = @args.to_set
          pairs = URI.decode_www_form(uri.query)
          remaining = pairs.reject { |k, _| remove_set.include?(k) }
          uri.query = remaining.empty? ? nil : URI.encode_www_form(remaining)
        end
        uri.to_s
      end
    end
  end
end
