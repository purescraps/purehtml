# PureHTML - Go Port

A declarative HTML parsing and extraction library for Go. Extract structured data from HTML documents using a simple YAML schema.

## Features

- **Declarative schemas** in YAML format
- **Pluggable backends** (default: goquery)
- **Chainable transformers** for value processing
- **Complex data extraction** (objects, arrays, unions)
- **Type-safe** extraction with error handling
- **URL resolution** and query parameter handling

## Installation

```bash
go get github.com/purescraps/purehtml/go
```

## Quick Start

```go
package main

import (
	"fmt"
	"log"
	"github.com/purescraps/purehtml/go"
)

func main() {
	html := `<html><body><h1 class="title">Hello World</h1></body></html>`

	config := &purehtml.PrimitiveValueConfig{
		Selector:  []string{".title"},
		Transform: []purehtml.TransformerSpec{{Name: "trim"}},
	}

	result, err := purehtml.ExtractFromString(purehtml.DefaultBackend, html, config, "")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(result) // Output: Hello World
}
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
```

### Union

Try multiple extraction strategies:

```yaml
union:
  - selector: .modern-date
  - selector: .legacy-date
```

### Constant

Return a constant value (optionally with selector condition):

```yaml
constant: "static_value"
selector: .conditional
```

## Transformers

The library includes 11 built-in transformers:

| Name | Input | Output | Description |
|------|-------|--------|-------------|
| `trim` | STRING | STRING | Trim whitespace |
| `number` | STRING | NUMBER | Convert string to number |
| `attr(name)` | Node | STRING | Extract attribute value |
| `html` | Node | STRING | Get inner HTML |
| `text` | Node | STRING | Get text content |
| `exists` | STRING | BOOLEAN | Check if element exists |
| `length` | STRING/ARRAY | NUMBER | Get length |
| `json` | STRING | * | Parse JSON from text |
| `resolve(baseUrl)` | STRING | STRING | Resolve relative URLs |
| `urlQueryParam(params...)` | STRING | STRING/OBJECT | Extract URL query parameters |
| `removeUrlQueryParam(params...)` | STRING | STRING | Remove query parameters |
| `removeLastPathSection` | STRING | STRING | Remove last path section from URL |

### Chaining Transformers

Transformers can be chained:

```yaml
transform: [trim, number]
```

Or in a list:

```yaml
transform:
  - trim
  - number
```

### Transformer Parameters

Some transformers accept parameters:

```yaml
transform: attr(href)
transform: resolve(https://example.com)
transform: urlQueryParam(id, page)
```

## Advanced Usage

### Custom Backend

Implement the `Backend` interface:

```go
type Backend interface {
	Load(html []byte) (Document, error)
}
```

Then use it with Extract:

```go
customBackend := &MyBackend{}
result, err := purehtml.Extract(customBackend, html, config, baseURL)
```

### Using ConfigFactory

Parse configuration from YAML strings:

```go
factory := purehtml.NewConfigFactory()
config, err := factory.FromYAML(`
selector: body
properties:
  title:
    selector: .title
`)

result, err := purehtml.ExtractFromString(purehtml.DefaultBackend, html, config, "")
```

## Package Structure

- `core.go` - Core types and interfaces
- `backend_goquery.go` - GoQuery backend implementation
- `config.go` - Configuration types
- `config_factory.go` - YAML parsing and factory
- `transformers.go` - All 11 transformer implementations
- `purehtml.go` - Main extraction functions
- `example/` - Example usage

## Error Handling

The library returns `InvalidParseInputError` on extraction failure:

```go
result, err := purehtml.Extract(backend, html, config, baseURL)
if err != nil {
	if parseErr, ok := err.(*purehtml.InvalidParseInputError); ok {
		fmt.Printf("Parse error at %s: %v\n", parseErr.Path, parseErr.Message)
	}
}
```

## Testing

Run tests:

```bash
go test -v
```

Run the example:

```bash
cd example
go run simple.go
```

## Compatibility

- Ported from TypeScript implementation
- Same YAML schema format
- Similar API and behavior
- Built on top of goquery for HTML parsing

## License

See parent project license
