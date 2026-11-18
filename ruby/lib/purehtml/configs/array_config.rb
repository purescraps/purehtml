# frozen_string_literal: true

require_relative "with_selector"
require_relative "primitive_value_config"

module PureHTML
  module Configs
    class ArrayConfig < WithSelector
      attr_reader :items, :transform

      def initialize(selector: nil, items: nil, transform: nil)
        super(selector: selector)
        @items = items
        @transform = transform.nil? ? [] : (transform.is_a?(Array) ? transform : [transform])
      end

      def extract(params)
        matches = get_all_matches(params.el, already_matched: params.element_already_matched, include_root: false)
        return nil if matches.nil?

        matches = matches.is_a?(Array) ? matches : [matches]
        conf = @items || PrimitiveValueConfig.new(selector: nil, transform: @transform)

        matches.map.with_index do |el, i|
          prop = params.property.empty? ? "[#{i}]" : "#{params.property}[#{i}]"
          sub_params = params.dup_with(el: el, property: prop, element_already_matched: false)
          conf.extract(sub_params)
        end
      end
    end
  end
end
