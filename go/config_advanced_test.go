package purehtml

import (
	"testing"
)

func TestComplexNestedObjectExtraction(t *testing.T) {
	html := `
	<article class="post">
		<h1 class="title">Article Title</h1>
		<div class="metadata">
			<span class="author">John Doe</span>
			<time datetime="2023-01-01">January 1, 2023</time>
		</div>
	</article>
	`

	config := &ObjectConfig{
		Selector: []string{"article.post"},
		Properties: map[string]Config{
			"title": &PrimitiveValueConfig{
				Selector:  []string{".title"},
				Transform: []TransformerSpec{{Name: "trim"}},
			},
			"author": &PrimitiveValueConfig{
				Selector:  []string{".metadata .author"},
				Transform: []TransformerSpec{{Name: "trim"}},
			},
			"date": &PrimitiveValueConfig{
				Selector:  []string{"time"},
				Transform: []TransformerSpec{{Name: "attr", Params: []string{"datetime"}}},
			},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	resultMap, ok := result.(map[string]interface{})
	if !ok {
		t.Fatalf("Expected map[string]interface{}, got %T", result)
	}

	if resultMap["title"] != "Article Title" {
		t.Errorf("Expected title 'Article Title', got %q", resultMap["title"])
	}
	if resultMap["author"] != "John Doe" {
		t.Errorf("Expected author 'John Doe', got %q", resultMap["author"])
	}
	if resultMap["date"] != "2023-01-01" {
		t.Errorf("Expected date '2023-01-01', got %q", resultMap["date"])
	}
}

func TestArrayOfObjectsExtraction(t *testing.T) {
	html := `
	<div class="products">
		<div class="product">
			<h2>Product 1</h2>
			<span class="price">$10</span>
		</div>
		<div class="product">
			<h2>Product 2</h2>
			<span class="price">$20</span>
		</div>
	</div>
	`

	config := &ArrayConfig{
		Selector: []string{".product"},
		Items: &ObjectConfig{
			Properties: map[string]Config{
				"name": &PrimitiveValueConfig{
					Selector:  []string{"h2"},
					Transform: []TransformerSpec{{Name: "trim"}},
				},
				"price": &PrimitiveValueConfig{
					Selector:  []string{".price"},
					Transform: []TransformerSpec{{Name: "trim"}},
				},
			},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	results, ok := result.([]interface{})
	if !ok {
		t.Fatalf("Expected []interface{}, got %T", result)
	}

	if len(results) != 2 {
		t.Errorf("Expected 2 products, got %d", len(results))
	}

	if len(results) > 0 {
		product1, ok := results[0].(map[string]interface{})
		if !ok {
			t.Fatalf("Expected map[string]interface{}, got %T", results[0])
		}
		if product1["name"] != "Product 1" {
			t.Errorf("Expected name 'Product 1', got %q", product1["name"])
		}
		if product1["price"] != "$10" {
			t.Errorf("Expected price '$10', got %q", product1["price"])
		}
	}
}

func TestUnionConfigWithMultipleSelectors(t *testing.T) {
	html := `
	<div>
		<span class="modern-date">2023-01-01</span>
		<span class="legacy-date">01/01/2023</span>
	</div>
	`

	config := &UnionConfig{
		Configs: []Config{
			&PrimitiveValueConfig{
				Selector:  []string{".modern-date"},
				Transform: []TransformerSpec{{Name: "trim"}},
			},
			&PrimitiveValueConfig{
				Selector:  []string{".legacy-date"},
				Transform: []TransformerSpec{{Name: "trim"}},
			},
		},
	}

	backend := DefaultBackend
	doc, err := backend.Load([]byte(html))
	if err != nil {
		t.Fatalf("Failed to load HTML: %v", err)
	}

	root := doc.Root()
	result, err := config.Extract(backend, root, "https://example.com", "")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	// Should return the first match
	expected := "2023-01-01"
	if result != expected {
		t.Errorf("Expected %q, got %q", expected, result)
	}
}

func TestConfigFactoryWithComplexYAML(t *testing.T) {
	yaml := `
selector: .article
properties:
  title:
    selector: h1
    transform: trim
  author:
    selector: .author
  tags:
    selector: .tag
    type: array
    items:
      transform: trim
`

	factory := NewConfigFactory()
	config, err := factory.FromYAML(yaml)
	if err != nil {
		t.Fatalf("Failed to parse YAML: %v", err)
	}

	objConfig, ok := config.(*ObjectConfig)
	if !ok {
		t.Fatalf("Expected *ObjectConfig, got %T", config)
	}

	if len(objConfig.Properties) != 3 {
		t.Errorf("Expected 3 properties, got %d", len(objConfig.Properties))
	}

	// Check that tags property is an array config
	if tagsConfig, ok := objConfig.Properties["tags"]; ok {
		_, isArray := tagsConfig.(*ArrayConfig)
		if !isArray {
			t.Errorf("Expected tags to be ArrayConfig, got %T", tagsConfig)
		}
	} else {
		t.Error("Expected 'tags' property to exist")
	}
}

func TestExtractWithConditionalConstant(t *testing.T) {
	html := `
	<div class="product" data-available="true">
		Product in stock
	</div>
	`

	config := &ConstantConfig{
		Selector: []string{".product[data-available='true']"},
		Constant: "in-stock",
	}

	backend := DefaultBackend
	doc, err := backend.Load([]byte(html))
	if err != nil {
		t.Fatalf("Failed to load HTML: %v", err)
	}

	root := doc.Root()
	result, err := config.Extract(backend, root, "https://example.com", "")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "in-stock" {
		t.Errorf("Expected 'in-stock', got %v", result)
	}
}

func TestExtractNestedArrays(t *testing.T) {
	html := `
	<div class="categories">
		<div class="category">
			<h3>Category 1</h3>
			<ul>
				<li>Item 1.1</li>
				<li>Item 1.2</li>
			</ul>
		</div>
	</div>
	`

	config := &ArrayConfig{
		Selector: []string{".category"},
		Items: &ObjectConfig{
			Properties: map[string]Config{
				"name": &PrimitiveValueConfig{
					Selector:  []string{"h3"},
					Transform: []TransformerSpec{{Name: "trim"}},
				},
				"items": &ArrayConfig{
					Selector: []string{"li"},
					Items: &PrimitiveValueConfig{
						Transform: []TransformerSpec{{Name: "trim"}},
					},
				},
			},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	results, ok := result.([]interface{})
	if !ok {
		t.Fatalf("Expected []interface{}, got %T", result)
	}

	if len(results) != 1 {
		t.Errorf("Expected 1 category, got %d", len(results))
	}

	if len(results) > 0 {
		category1, ok := results[0].(map[string]interface{})
		if !ok {
			t.Fatalf("Expected map[string]interface{}, got %T", results[0])
		}
		if category1["name"] != "Category 1" {
			t.Errorf("Expected name 'Category 1', got %q", category1["name"])
		}

		items, ok := category1["items"].([]interface{})
		if !ok {
			t.Fatalf("Expected []interface{} for items, got %T", category1["items"])
		}
		if len(items) != 2 {
			t.Errorf("Expected 2 items in category 1, got %d", len(items))
		}
	}
}
