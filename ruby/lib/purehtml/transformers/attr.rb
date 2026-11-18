# frozen_string_literal: true

require_relative "../transformer"

module PureHTML
  module Transformers
    class AttrTransformer < Transformer
      def self.transformer_name
        "attr"
      end

      def transform(params)
        el = params.el
        return nil if el.nil?

        if @args.empty?
          el.attr
        elsif @args.length == 1
          el.attr(@args[0])
        else
          @args.each_with_object({}) do |arg, acc|
            acc[arg] = el.attr(arg)
          end
        end
      end
    end
  end
end
