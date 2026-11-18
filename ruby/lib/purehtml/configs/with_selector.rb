# frozen_string_literal: true

require_relative "../config"

module PureHTML
  module Configs
    class WithSelector < Config
      attr_reader :selector

      def initialize(selector: nil)
        super()
        @selector = selector
      end

      def get_all_matches(node, already_matched: false, include_root: false)
        return node if already_matched
        return node if @selector.nil?

        if include_root && node.is_selector?(@selector)
          return node
        end

        matches = node.find(@selector)
        matches.nil? ? [] : matches
      end

      def get_first_match(node, already_matched: false, include_root: false)
        matches = get_all_matches(node, already_matched: already_matched, include_root: include_root)
        matches.is_a?(Array) ? matches.first : matches
      end
    end
  end
end
