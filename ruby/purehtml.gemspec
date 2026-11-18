# frozen_string_literal: true

require_relative "lib/purehtml/version"

Gem::Specification.new do |spec|
  spec.name          = "purehtml"
  spec.version       = PureHTML::VERSION
  spec.authors       = ["Fatih Kaya"]
  spec.email         = ["1994274@gmail.com"]

  spec.summary       = "Declarative HTML parsing and data extraction library for Ruby"
  spec.description   = "PureHTML is a parsing specification and library for extracting JSON from HTML documents using simple YAML schemas."
  spec.homepage      = "https://purescraps.github.io/purehtml/"
  spec.license       = "MIT"
  spec.required_ruby_version = ">= 2.6.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/purescraps/purehtml"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir.glob("{lib}/**/*") + %w[README.md LICENSE purehtml.gemspec Rakefile]
  end
  spec.require_paths = ["lib"]

  spec.add_dependency "nokogiri", ">= 1.10.0"

  spec.add_development_dependency "rake", "~> 12.3"
  spec.add_development_dependency "minitest", "~> 5.11"
end
