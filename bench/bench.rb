# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path("../ruby/lib", __dir__)
require "optparse"
require "purehtml"

# Default extractions per backend. Nokogiri is slow on heavy pages, so it runs
# fewer. --iterations overrides every backend.
DEFAULT_ITERATIONS = { nokogiri: 20, nokolexbor: 500 }.freeze
iterations = nil
url = "http://example.com"

parser = OptionParser.new do |opts|
  opts.banner = "Usage: bench.rb [--iterations N] [--url URL] [HTML YAML]"
  opts.on("--iterations N", Integer) { |n| iterations = n }
  opts.on("--url URL") { |u| url = u }
end

begin
  files = parser.parse(ARGV)
rescue OptionParser::ParseError => e
  warn e.message, parser.banner
  exit 2
end

if files.empty?
  files = %w[files/sample-2.html files/sample-2.yml].map { |f| File.expand_path(f, __dir__) }
end

if (iterations && iterations < 1) || files.length != 2
  warn parser.banner
  exit 2
end

backends = [[:nokogiri, PureHTML::NokogiriBackend.new]]
begin
  backends << [:nokolexbor, PureHTML::NokolexborBackend.new]
rescue LoadError
  # nokolexbor not installed
end

html_path, yaml_path = files
config = PureHTML::ConfigFactory.from_file(yaml_path)
# Arbitrary pages may contain invalid UTF-8.
html = File.read(html_path, encoding: "UTF-8").scrub

backends.each do |name, backend|
  doc = backend.load(html)
  count = iterations || DEFAULT_ITERATIONS.fetch(name)

  puts "Running #{name} benchmark for #{count} iterations: #{html_path} + #{yaml_path}"
  puts "extract result: #{PureHTML.extract(config, doc, url, backend: backend)}"

  start = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  count.times do
    PureHTML.extract(config, doc, url, backend: backend)
  end
  duration = Process.clock_gettime(Process::CLOCK_MONOTONIC) - start
  throughput = count / duration

  puts format("Throughput: %.2f extracts/second\n\n", throughput)
end
