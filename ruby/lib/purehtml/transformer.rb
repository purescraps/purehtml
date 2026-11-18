# frozen_string_literal: true

module PureHTML
  class Transformer
    attr_reader :args

    def initialize(args = [])
      @args = args || []
    end

    def transform(params)
      raise NotImplementedError
    end

    def self.transformer_name
      raise NotImplementedError
    end
  end
end
