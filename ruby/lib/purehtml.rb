# frozen_string_literal: true

require_relative "purehtml/version"
require_relative "purehtml/errors"
require_relative "purehtml/extract_params"
require_relative "purehtml/backend"
require_relative "purehtml/transformer"
require_relative "purehtml/transformer_factory"
require_relative "purehtml/transformers"
require_relative "purehtml/config"
require_relative "purehtml/configs/with_selector"
require_relative "purehtml/configs/primitive_value_config"
require_relative "purehtml/configs/object_config"
require_relative "purehtml/configs/array_config"
require_relative "purehtml/configs/union_config"
require_relative "purehtml/configs/constant_config"
require_relative "purehtml/configs/default_value_config"
require_relative "purehtml/config_factory"

module PureHTML
  class << self
    def backend
      @backend ||= NokogiriBackend.new
    end

    def backend=(backend)
      @backend = backend.nil? ? nil : resolve_backend(backend)
    end

    def extract(config, html, url = "", backend: nil)
      active_backend = if backend
        resolve_backend(backend)
      elsif defined?(::Nokolexbor::Node) && html.is_a?(::Nokolexbor::Node)
        NokolexborBackend.new
      elsif defined?(::Nokogiri::XML::Node) && html.is_a?(::Nokogiri::XML::Node)
        NokogiriBackend.new
      else
        self.backend
      end

      doc = html.is_a?(Document) ? html : active_backend.load(html)
      params = ExtractParams.new(
        doc: doc,
        el: doc.root,
        url: url,
        property: "",
        val: nil,
        element_already_matched: false
      )
      config.extract(params)
    end

    def resolve_backend(backend)
      case backend
      when :nokogiri, "nokogiri"
        NokogiriBackend.new
      when :nokolexbor, "nokolexbor"
        NokolexborBackend.new
      when Class
        backend.new
      else
        if backend.respond_to?(:load)
          backend
        else
          raise ArgumentError, "Unsupported backend: #{backend.inspect}"
        end
      end
    end
  end
end
