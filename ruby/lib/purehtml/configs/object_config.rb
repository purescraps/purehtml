# frozen_string_literal: true

require_relative "with_selector"

module PureHTML
  module Configs
    class ObjectConfig < WithSelector
      attr_reader :properties

      def initialize(selector: nil, properties: {})
        super(selector: selector)
        @properties = properties || {}
      end

      def extract(params)
        el = get_first_match(params.el, already_matched: params.element_already_matched, include_root: false)
        return nil if el.nil?

        result = {}
        @properties.each do |key, cfg|
          prop = params.property.empty? ? key.to_s : "#{params.property}.#{key}"
          sub_params = params.dup_with(el: el, property: prop, element_already_matched: false)
          result[key.to_s] = cfg.extract(sub_params)
        end
        result
      end
    end
  end
end
