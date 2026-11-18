# frozen_string_literal: true

require_relative "../config"

module PureHTML
  module Configs
    class DefaultValueConfig < Config
      attr_reader :inner, :default_value

      def initialize(inner, default_value)
        super()
        @inner = inner
        @default_value = default_value
      end

      def extract(params)
        val = @inner.extract(params)
        val.nil? ? @default_value : val
      end
    end
  end
end
