package main

import (
	"fmt"
	"log"

	"github.com/purescraps/purehtml/go"
)

func main() {
	html := `
	<html>
		<body>
			<div class="title">Hello World</div>
			<div class="description">This is a test</div>
			<ul class="items">
				<li><span class="name">Item 1</span> - <span class="price">$10</span></li>
				<li><span class="name">Item 2</span> - <span class="price">$20</span></li>
				<li><span class="name">Item 3</span> - <span class="price">$30</span></li>
			</ul>
			<a href="/page" id="link">Link</a>
		</body>
	</html>
	`

	yamlConfig := `
selector: body
properties:
  title:
    selector: .title
    transform: trim
  description:
    selector: .description
  items:
    selector: ul.items li
    type: array
    items:
      properties:
        name:
          selector: .name
          transform: trim
        price:
          selector: .price
          transform: trim
  link:
    selector: '#link'
    transform: [attr(href), resolve(https://example.com)]
`

	// Create config from YAML
	factory := purehtml.NewConfigFactory()
	config, err := factory.FromYAML(yamlConfig)
	if err != nil {
		log.Fatalf("Failed to parse config: %v", err)
	}

	// Extract data
	result, err := purehtml.ExtractFromString(purehtml.DefaultBackend, html, config, "https://example.com")
	if err != nil {
		log.Fatalf("Failed to extract: %v", err)
	}

	fmt.Printf("Result: %+v\n", result)
}
