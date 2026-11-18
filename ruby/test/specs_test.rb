# frozen_string_literal: true

require_relative "test_helper"

class SpecsTest < Minitest::Test
  SPECS_DIR = File.expand_path("../../specs", __dir__)

  def self.spec_files
    Dir.glob(File.join(SPECS_DIR, "**/*.{yaml,yml}")).sort
  end

  def self.load_yaml_file(file)
    YAML.load_file(file, aliases: true)
  rescue ArgumentError
    YAML.load_file(file)
  end

  spec_files.each do |file|
    relative_path = file.sub("#{SPECS_DIR}/", "")
    data = load_yaml_file(file)
    specs = data["specs"] || []

    specs.each_with_index do |spec, idx|
      description = spec["description"] || "test_#{idx}"
      sanitized_name = "test_#{relative_path}_#{idx}_#{description}".gsub(/[^a-zA-Z0-9_]+/, "_")

      define_method(sanitized_name) do
        config = PureHTML::ConfigFactory.from_hash(spec["configuration"])
        result = PureHTML.extract(config, spec["input"], "http://example.com")
        expected = spec["expected"]

        # Normalize via JSON round-trip so keys, numbers, and types compare cleanly
        result_json = JSON.parse(result.to_json)
        expected_json = JSON.parse(expected.to_json)

        if expected_json.nil?
          assert_nil result_json, "Spec failed: #{relative_path} - #{description}"
        else
          assert_equal expected_json, result_json, "Spec failed: #{relative_path} - #{description}"
        end
      end
    end
  end
end
