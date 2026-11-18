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
    attr_writer :backend

    def backend
      @backend ||= NokogiriBackend.new
    end

    def extract(config, html, url = "", backend: nil)
      active_backend = backend || self.backend
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
  end
end
