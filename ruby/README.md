# PureHTML for Ruby

PureHTML is a declarative HTML parsing and extraction library for Ruby. Extract structured JSON/data from HTML documents using simple YAML schemas.

- [Documentation & Playground](https://purescraps.github.io/purehtml/)

## Features

- **Declarative Schemas**: Simple YAML definitions for HTML data extraction.
- **Pluggable Backends**: Built on top of [Nokogiri](https://nokogiri.org).
- **Extensible Transformers**: Value transformation chain (e.g. `trim`, `number`, `attr`, `html`, `json`, `jsonpath`, `split`, `join`, `replace`, etc.).
- **Complex Structures**: Supports primitives, nested objects, arrays, unions, constants, and default values.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'purehtml'
```

Or install it yourself as:

```bash
gem install purehtml
```

## Quick Start

```ruby
require 'purehtml'

yaml_string = <<~YAML
  selector: span
  type: array
  items: {}
YAML

html_string = <<~HTML
  <div>
    <span>a</span>
    <span>b</span>
    <span>c</span>
  </div>
HTML

config = PureHTML::ConfigFactory.from_yaml(yaml_string)
result = PureHTML.extract(config, html_string, "http://example.com")

puts result.inspect
# => ["a", "b", "c"]
```

## Configuration Types

### Primitive Value

Extract a single value:

```yaml
selector: .title
transform: trim
```

### Object

Extract multiple properties:

```yaml
selector: body
properties:
  title:
    selector: .title
    transform: trim
  description:
    selector: .desc
```

### Array

Extract multiple items:

```yaml
selector: ul.items li
type: array
items:
  properties:
    name:
      selector: .name
      transform: trim
    price:
      selector: .price
      type: number
```

### Union

Try multiple extraction strategies until one matches:

```yaml
union:
  - selector: .modern-date
  - selector: .legacy-date
```

### Constant

Return a constant value:

```yaml
selector: .featured-badge
constant: true
default: false
```

### Default Fallback

Provide a fallback value when a selector does not match:

```yaml
selector: .non-existent
default: "N/A"
```

## Development

Run tests with `rake`:

```bash
cd ruby
rake test
```

## License

[MIT](LICENSE)
