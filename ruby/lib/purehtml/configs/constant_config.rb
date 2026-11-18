# frozen_string_literal: true

require_relative "with_selector"

module PureHTML
  module Configs
    class ConstantConfig < WithSelector
      attr_reader :constant

      def initialize(constant, selector: nil)
        super(selector: selector)
        @constant = constant
      end

      def extract(params)
        if @selector
          matches = get_all_matches(params.el, already_matched: false, include_root: true)
          if matches.is_a?(Array) && matches.empty?
            return nil
          end
        end
        @constant
      end
    end
  end
end
