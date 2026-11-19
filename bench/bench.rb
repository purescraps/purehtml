# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path("../ruby/lib", __dir__)
require "purehtml"

iterations = 5000
config = PureHTML::ConfigFactory.from_file(File.expand_path("files/sample-1.yaml", __dir__))
html = File.read(File.expand_path("files/sample-1.html", __dir__))

backends = [[:nokogiri, PureHTML::NokogiriBackend.new]]
begin
  backends << [:nokolexbor, PureHTML::NokolexborBackend.new]
rescue LoadError
  # nokolexbor not installed
end

backends.each do |name, backend|
  doc = backend.load(html)

  puts "Running #{name} benchmark for #{iterations} iterations."
  puts "extract result: #{PureHTML.extract(config, doc, 'http://example.com', backend: backend)}"

  start = Time.now
  iterations.times do
    PureHTML.extract(config, doc, "http://example.com", backend: backend)
  end
  duration = Time.now - start
  throughput = iterations / duration

  puts format("Throughput: %.2f extracts/second\n\n", throughput)
end
