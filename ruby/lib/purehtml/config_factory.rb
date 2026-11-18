# frozen_string_literal: true

require "yaml"
require_relative "configs/with_selector"
require_relative "configs/primitive_value_config"
require_relative "configs/object_config"
require_relative "configs/array_config"
require_relative "configs/union_config"
require_relative "configs/constant_config"
require_relative "configs/default_value_config"
require_relative "transformer_factory"
require_relative "errors"

module PureHTML
  class ConfigFactory
    def self.from_file(path)
      from_yaml(File.read(path))
    end

    def self.from_yaml(yaml_or_hash)
      hash = if yaml_or_hash.is_a?(String)
        begin
          YAML.safe_load(yaml_or_hash, aliases: true)
        rescue ArgumentError
          YAML.safe_load(yaml_or_hash)
        end
      else
        yaml_or_hash
      end
      from_hash(hash)
    end

    def self.from_hash(plain)
      plain = stringify_keys(plain || {})
      constant = plain["constant"]
      selector_orig = plain["selector"]
      transform_orig = plain["transform"]
      properties = plain["properties"]
      items = plain["items"]
      union = plain["union"]
      default_value = plain["default"]
      type = plain["type"]

      selector = generate_selector(selector_orig)
      expected_type = detect_expected_type(plain)
      transformers = generate_transform(transform_orig)

      config = case expected_type
      when "constant"
        Configs::ConstantConfig.new(constant, selector: selector)
      when "object"
        prop_configs = if properties.is_a?(Hash)
          properties.transform_keys(&:to_s).transform_values { |v| from_hash(v) }
        else
          {}
        end
        Configs::ObjectConfig.new(selector: selector, properties: prop_configs)
      when "array"
        Configs::ArrayConfig.new(
          selector: selector,
          items: items ? from_hash(items) : nil,
          transform: transformers
        )
      when "union"
        Configs::UnionConfig.new((union || []).map { |u| from_hash(u) })
      else
        coerced_transformers = append_type_coercion(type, transformers)
        Configs::PrimitiveValueConfig.new(selector: selector, transform: coerced_transformers)
      end

      if plain.key?("default")
        Configs::DefaultValueConfig.new(config, default_value)
      else
        config
      end
    end

    def self.generate_selector(selector)
      if selector.is_a?(String)
        selector.empty? ? nil : selector
      elsif selector.is_a?(Array)
        joined = selector.map { |s| generate_selector(s) }.compact.join(", ")
        joined.empty? ? nil : joined
      elsif selector.is_a?(Hash)
        sel = selector["selector"] || selector[:selector]
        generate_selector(sel)
      elsif selector.nil?
        nil
      else
        raise Error, "Unexpected selector type: #{selector.class}"
      end
    end

    def self.generate_transform(transform)
      return nil if transform.nil?

      if transform.is_a?(String)
        [TransformerFactory.create(transform)]
      elsif transform.is_a?(Array)
        transform.map { |t| TransformerFactory.create(t) }
      else
        raise Error, "Unexpected transform type: #{transform.class}"
      end
    end

    def self.append_type_coercion(type, transformers)
      return transformers unless %w[number boolean].include?(type)

      coercion = TransformerFactory.create(type)
      (transformers || []) + [coercion]
    end

    def self.detect_expected_type(conf)
      return "object" if conf.key?("properties") || conf["type"] == "object"
      return "array" if conf.key?("items") || conf["type"] == "array"
      return "union" if conf.key?("union")
      return "constant" if conf.key?("constant")

      "primitive"
    end

    def self.stringify_keys(hash)
      return hash unless hash.is_a?(Hash)

      hash.transform_keys(&:to_s)
    end
    private_class_method :stringify_keys
  end
end
