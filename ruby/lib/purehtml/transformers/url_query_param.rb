# frozen_string_literal: true

require "uri"
require_relative "../transformer"
require_relative "../errors"

module PureHTML
  module Transformers
    class UrlQueryParamTransformer < Transformer
      def self.transformer_name
        "urlQueryParam"
      end

      def transform(params)
        val = params.val
        unless val.is_a?(String)
          raise InvalidParseInputError.new("urlQueryParam: expected string. Got #{val.class}", property: params.property, value: val)
        end

        uri = URI.parse(val)
        unless uri.query
          return @args.empty? ? {} : (@args.length == 1 ? nil : @args.map { |a| [a, nil] }.to_h)
        end

        pairs = URI.decode_www_form(uri.query)
        if @args.empty?
          pairs.to_h
        elsif @args.length == 1
          pairs.find { |k, _| k == @args[0] }&.last
        else
          @args.map { |arg| [arg, pairs.find { |k, _| k == arg }&.last] }.to_h
        end
      end
    end
  end
end
