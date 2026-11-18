# PureHTML

[![Documentation & Playground](https://img.shields.io/badge/docs-playground-blue.svg)](https://purescraps.github.io/purehtml/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**PureHTML** is a declarative, language-agnostic specification and toolkit for extracting structured JSON data from HTML documents using simple YAML or JSON schemas.

Instead of writing repetitive, error-prone DOM querying and scraping logic in application code, PureHTML allows you to describe *what* data to extract and *how* to transform it declaratively. The schema can be authored, validated, and shared across different services and programming languages.

Explore the documentation and interactive playground at **[https://purescraps.github.io/purehtml/](https://purescraps.github.io/purehtml/)**.

---

## Language Ports

This monorepo houses official implementations of the PureHTML specification across multiple languages, all validated against a shared compliance test suite:

| Language | Directory | Package / Module | Badges |
| :--- | :--- | :--- | :--- |
| **TypeScript / JavaScript** | [`typescript/`](typescript/) | `@purescraps/purehtml` | [![npm](https://img.shields.io/npm/v/@purescraps/purehtml.svg)](https://www.npmjs.com/package/@purescraps/purehtml) |
| **Go** | [`go/`](go/) | `github.com/purescraps/purehtml/go` | [![Go Reference](https://pkg.go.dev/badge/github.com/purescraps/purehtml/go.svg)](https://pkg.go.dev/github.com/purescraps/purehtml/go) |
| **Python** | [`python/`](python/) | `purehtml-purescraps` | [![PyPI](https://img.shields.io/pypi/v/purehtml-purescraps.svg)](https://pypi.org/project/purehtml-purescraps/) |
| **Java** | [`java/`](java/) | `com.purescraps.purehtml:purehtml` | [![Maven Central](https://img.shields.io/maven-central/v/com.purescraps.purehtml/purehtml.svg)](https://central.sonatype.com/artifact/com.purescraps.purehtml/purehtml) |
| **Ruby** | [`ruby/`](ruby/) | `purehtml` | [![Gem Version](https://badge.fury.io/rb/purehtml.svg)](https://rubygems.org/gems/purehtml) |

---

## How It Works

PureHTML separates data extraction into declarative schemas, an HTML document input, and an extraction engine.

### 1. Define a Schema (`extract.yaml`)

```yaml
selector: .product-card
type: array
items:
  properties:
    title:
      selector: h2.title
      transform: trim
    price:
      selector: .price
      transform: [trim, number]
    link:
      selector: a.buy-btn
      transform:
        - attr(href)
        - resolve(https://example.com)
```

### 2. Run with Your Language of Choice

````carousel
```typescript
import { ConfigFactory, extract } from '@purescraps/purehtml';

const config = ConfigFactory.fromYAML(yamlString);
const result = extract(htmlString, config, 'https://example.com');
```
<!-- slide -->
```go
import "github.com/purescraps/purehtml/go"

factory := purehtml.NewConfigFactory()
config, _ := factory.FromYAML(yamlString)
result, _ := purehtml.ExtractFromString(purehtml.DefaultBackend, htmlString, config, "https://example.com")
```
<!-- slide -->
```python
from purehtml import ConfigFactory, extract

config = ConfigFactory.from_yaml(yamlString)
result = extract(config, htmlString, "https://example.com")
```
<!-- slide -->
```java
import com.purescraps.purehtml.configs.ConfigFactory;
import static com.purescraps.purehtml.PureHTML.extract;

var config = ConfigFactory.fromYAML(yamlString);
var result = extract(config, htmlString, "https://example.com");
```
<!-- slide -->
```ruby
require 'purehtml'

config = PureHTML::ConfigFactory.from_yaml(yamlString)
result = PureHTML.extract(config, htmlString, "https://example.com")
```
````

---

## Key Features

- **Declarative Schemas**: YAML-based definitions for extracting primitives, nested objects, arrays, constants, unions, and default fallbacks.
- **Chainable Transformers**: 20+ built-in transformers including `trim`, `number`, `boolean`, `attr`, `html`, `text`, `replace`, `split`, `join`, `json`, `jsonpath`, `resolve`, `urlQueryParam`, and more.
- **Cross-Language Compliance**: All ports are continuously tested against shared test fixtures in [`specs/`](specs/) to guarantee identical parsing and transformation behavior.
- **Zero Runtime Overhead Schemas**: Pre-compile schemas once and execute them efficiently over millions of documents.

---

## Specification & Testing

The PureHTML schema definition is located at [`spec.schema.yaml`](spec.schema.yaml) and [`typescript/src/config-schema.json`](typescript/src/config-schema.json).

Shared cross-language test suites are maintained in [`specs/`](specs/). Each language implementation runs these specifications to ensure complete compatibility:

- **Go**: `cd go && go test -v`
- **Python**: `cd python && python3 run_tests.py`
- **Java**: `cd java && mvn test`
- **TypeScript**: `cd typescript && pnpm test`
- **Ruby**: `cd ruby && rake test`

---

## IDE Support & Autocompletions

You can use [yaml-language-server](https://github.com/redhat-developer/yaml-language-server) for schema validation and autocompletions in YAML files.

Add this modeline to the top of your YAML schema:

```yaml
# yaml-language-server: $schema=typescript/src/config-schema.json
```

For **[VS Code](https://code.visualstudio.com/)**, install the [Red Hat YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).

---

## License

[MIT](LICENSE)
