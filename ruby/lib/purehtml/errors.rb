# frozen_string_literal: true

module PureHTML
  class Error < StandardError; end

  class InvalidParseInputError < Error
    attr_reader :property, :value

    def initialize(message = nil, property: nil, value: nil)
      @property = property
      @value = value
      super(message || "Invalid parse input")
    end
  end

  class ValidationError < Error
    attr_reader :errors

    def initialize(errors)
      @errors = errors
      super("Invalid config: #{errors.inspect}")
    end
  end
end
