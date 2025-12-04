package purehtml

import (
	"testing"
)

func TestAttrTransformerExtractsAttribute(t *testing.T) {
	html := `<a href="https://example.com">Link</a>`

	config := &PrimitiveValueConfig{
		Selector: []string{"a"},
		Transform: []TransformerSpec{
			{Name: "attr", Params: []string{"href"}},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	expected := "https://example.com"
	if result != expected {
		t.Errorf("Expected %q, got %q", expected, result)
	}
}

func TestAttrTransformerReturnsEmptyStringForMissingAttribute(t *testing.T) {
	html := `<div class="test">Content</div>`

	config := &PrimitiveValueConfig{
		Selector: []string{"div"},
		Transform: []TransformerSpec{
			{Name: "attr", Params: []string{"data-missing"}},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "" {
		t.Errorf("Expected empty string, got %q", result)
	}
}

func TestAttrTransformerWithoutParametersReturnsAllAttributes(t *testing.T) {
	html := `<div class="test" id="main" data-value="123">Content</div>`

	config := &PrimitiveValueConfig{
		Selector: []string{"div"},
		Transform: []TransformerSpec{
			{Name: "attr"},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	attrs, ok := result.(map[string]string)
	if !ok {
		t.Fatalf("Expected map[string]string, got %T", result)
	}

	if attrs["class"] != "test" {
		t.Errorf("Expected class='test', got %q", attrs["class"])
	}
	if attrs["id"] != "main" {
		t.Errorf("Expected id='main', got %q", attrs["id"])
	}
	if attrs["data-value"] != "123" {
		t.Errorf("Expected data-value='123', got %q", attrs["data-value"])
	}
}

func TestAttrTransformerWithMultipleAttributes(t *testing.T) {
	html := `<img src="image.jpg" alt="An image" title="Title text" />`

	tests := []struct {
		name     string
		attr     string
		expected string
	}{
		{"src attribute", "src", "image.jpg"},
		{"alt attribute", "alt", "An image"},
		{"title attribute", "title", "Title text"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			config := &PrimitiveValueConfig{
				Selector: []string{"img"},
				Transform: []TransformerSpec{
					{Name: "attr", Params: []string{tt.attr}},
				},
			}

			result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
			if err != nil {
				t.Fatalf("Failed to extract: %v", err)
			}

			if result != tt.expected {
				t.Errorf("Expected %q, got %q", tt.expected, result)
			}
		})
	}
}

func TestAttrTransformerInArray(t *testing.T) {
	html := `
	<div>
		<a href="page1.html">Page 1</a>
		<a href="page2.html">Page 2</a>
		<a href="page3.html">Page 3</a>
	</div>
	`

	config := &ArrayConfig{
		Selector: []string{"a"},
		Items: &PrimitiveValueConfig{
			Transform: []TransformerSpec{
				{Name: "attr", Params: []string{"href"}},
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

	expectedHrefs := []string{"page1.html", "page2.html", "page3.html"}
	if len(results) != len(expectedHrefs) {
		t.Errorf("Expected %d results, got %d", len(expectedHrefs), len(results))
	}

	for i, expected := range expectedHrefs {
		if i < len(results) && results[i] != expected {
			t.Errorf("Expected results[%d]=%q, got %q", i, expected, results[i])
		}
	}
}

func TestAttrTransformerWithDataAttributes(t *testing.T) {
	html := `<div data-user-id="123" data-name="John">Content</div>`

	config := &PrimitiveValueConfig{
		Selector: []string{"div"},
		Transform: []TransformerSpec{
			{Name: "attr", Params: []string{"data-user-id"}},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "123" {
		t.Errorf("Expected '123', got %q", result)
	}
}
