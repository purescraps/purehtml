# frozen_string_literal: true

require_relative "../config"
require_relative "with_selector"

module PureHTML
  module Configs
    class UnionConfig < Config
      attr_reader :configs

      def initialize(configs)
        super()
        @configs = configs || []
      end

      def extract(params)
        parent = params.el
        @configs.each do |config|
          if config.is_a?(WithSelector)
            matches = config.get_all_matches(parent, already_matched: false, include_root: true)
            next if matches.nil? || (matches.is_a?(Array) && matches.empty?)

            is_array = matches.is_a?(Array)
            matched_el = if is_array
              matches.length > 1 ? parent : matches[0]
            else
              matches
            end

            element_already_matched = !is_array || matches.length == 1

            sub_params = params.dup_with(
              el: matched_el,
              element_already_matched: element_already_matched
            )
            return config.extract(sub_params)
          else
            sub_params = params.dup_with(el: parent)
            val = config.extract(sub_params)
            return val unless val.nil?
          end
        end
        nil
      end
    end
  end
end
