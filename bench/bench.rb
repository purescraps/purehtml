# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path("../ruby/lib", __dir__)
require "purehtml"

iterations = 5000
config = PureHTML::ConfigFactory.from_file(File.expand_path("files/sample-1.yaml", __dir__))
html = File.read(File.expand_path("files/sample-1.html", __dir__))
doc = PureHTML.backend.load(html)

puts "Running benchmark for #{iterations} iterations."
puts "extract result: #{PureHTML.extract(config, doc, 'http://example.com')}"

start = Time.now
iterations.times do
  PureHTML.extract(config, doc, "http://example.com")
end
duration = Time.now - start
throughput = iterations / duration

puts format("Throughput: %.2f extracts/second", throughput)
