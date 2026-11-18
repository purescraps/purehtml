# frozen_string_literal: true

require_relative "with_selector"

module PureHTML
  module Configs
    class PrimitiveValueConfig < WithSelector
      attr_reader :transform

      def initialize(selector: nil, transform: nil)
        super(selector: selector)
        @transform = transform.nil? ? [] : (transform.is_a?(Array) ? transform : [transform])
      end

      def extract(params)
        el = get_first_match(params.el, already_matched: params.element_already_matched, include_root: false)
        val = el ? el.text : nil

        return val if @transform.empty?

        transform_val(@transform, params.dup_with(el: el, val: val))
      end

      private

      def transform_val(transformers, params)
        current_val = params.val
        transformers.each do |tr|
          p = params.dup_with(val: current_val)
          current_val = tr.transform(p)
        end
        current_val
      end
    end
  end
end
