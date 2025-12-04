package purehtml

import (
	"strings"
	"testing"
)

const sample = `<div>
  some
  <span>nested</span>
  <p>elements</p>
</div>`

func TestExtractRootElement(t *testing.T) {
	// The extract() must start from the root node so we'll get
	// the outer-most element at beginning
	html := sample
	backend := DefaultBackend
	doc, err := backend.Load([]byte(html))
	if err != nil {
		t.Fatalf("Failed to load HTML: %v", err)
	}

	// Extract the text from the root div element
	config := &PrimitiveValueConfig{
		Selector: []string{"div"},
	}

	root := doc.Root()
	result, err := config.Extract(backend, root, "https://example.com", "")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	// Result should be the text content of the div
	expected := root.Find("div")[0].Text()

	if result != expected {
		t.Errorf("Expected %q, got %q", expected, result)
	}
}

func TestExtractWithSelector(t *testing.T) {
	html := `<html>
		<body>
			<div class="container">
				<span id="target">Found me!</span>
			</div>
		</body>
	</html>`

	config := &PrimitiveValueConfig{
		Selector:  []string{"#target"},
		Transform: []TransformerSpec{{Name: "trim"}},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "Found me!" {
		t.Errorf("Expected 'Found me!', got %q", result)
	}
}

func TestExtractReturnsNilForMissingSelector(t *testing.T) {
	html := `<html><body><div>content</div></body></html>`

	config := &PrimitiveValueConfig{
		Selector: []string{".nonexistent"},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != nil {
		t.Errorf("Expected nil, got %v", result)
	}
}

func TestExtractWhitespaceHandling(t *testing.T) {
	html := `<div>

		Text with whitespace

	</div>`

	config := &PrimitiveValueConfig{
		Selector:  []string{"div"},
		Transform: []TransformerSpec{{Name: "trim"}},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	expected := "Text with whitespace"
	if result != expected {
		t.Errorf("Expected %q, got %q", expected, result)
	}
}

func TestExtractWithMultipleTransformers(t *testing.T) {
	html := `<div>  42  </div>`

	config := &PrimitiveValueConfig{
		Selector: []string{"div"},
		Transform: []TransformerSpec{
			{Name: "trim"},
			{Name: "number"},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	expected := 42.0
	if result != expected {
		t.Errorf("Expected %v, got %v", expected, result)
	}
}

func TestExtractFromString(t *testing.T) {
	html := `<span class="name">John Doe</span>`

	config := &PrimitiveValueConfig{
		Selector:  []string{".name"},
		Transform: []TransformerSpec{{Name: "trim"}},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "John Doe" {
		t.Errorf("Expected 'John Doe', got %q", result)
	}
}

func TestExtractPreservesLineBreaksInText(t *testing.T) {
	html := `<div>Line 1
Line 2
Line 3</div>`

	config := &PrimitiveValueConfig{
		Selector: []string{"div"},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	// Check that text was extracted
	resultStr, ok := result.(string)
	if !ok {
		t.Errorf("Expected string, got %T", result)
	}

	// Should contain all three lines (without leading/trailing whitespace)
	if !strings.Contains(resultStr, "Line 1") || !strings.Contains(resultStr, "Line 2") || !strings.Contains(resultStr, "Line 3") {
		t.Errorf("Expected to find all lines in result: %q", resultStr)
	}
}
