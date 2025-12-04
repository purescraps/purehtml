package purehtml

import (
	"testing"
)

const testHTML = `<div>
  <span>experiment</span>
  <p>experiment</p>
</div>`

func TestConstantConfigBasic(t *testing.T) {
	html := testHTML
	config := &ConstantConfig{
		Constant: "foo",
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

	if result != "foo" {
		t.Errorf("Expected 'foo', got %q", result)
	}
}

func TestConstantConfigWithSelector(t *testing.T) {
	html := testHTML
	config := &ConstantConfig{
		Selector: []string{"span"},
		Constant: map[string]interface{}{"custom": "object"},
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

	if resultMap, ok := result.(map[string]interface{}); ok {
		if resultMap["custom"] != "object" {
			t.Errorf("Expected custom field 'object', got %q", resultMap["custom"])
		}
	} else {
		t.Errorf("Expected map[string]interface{}, got %T", result)
	}
}

func TestConstantConfigReturnsNullIfNothingMatches(t *testing.T) {
	html := testHTML
	config := &ConstantConfig{
		Selector: []string{"a"},
		Constant: map[string]interface{}{"custom": "object"},
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

	if result != nil {
		t.Errorf("Expected nil, got %v", result)
	}
}

func TestConstantConfigFromYAML(t *testing.T) {
	yaml := `constant: foo`

	factory := NewConfigFactory()
	config, err := factory.FromYAML(yaml)
	if err != nil {
		t.Fatalf("Failed to parse YAML: %v", err)
	}

	constConfig, ok := config.(*ConstantConfig)
	if !ok {
		t.Errorf("Expected *ConstantConfig, got %T", config)
	}

	if constConfig.Constant != "foo" {
		t.Errorf("Expected constant 'foo', got %v", constConfig.Constant)
	}
}

func TestConstantConfigWithIntValue(t *testing.T) {
	html := `<div><span id="marker">test</span></div>`
	config := &ConstantConfig{
		Selector: []string{"#marker"},
		Constant: 42,
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

	if result != 42 {
		t.Errorf("Expected 42, got %v", result)
	}
}

func TestConstantConfigWithBoolValue(t *testing.T) {
	html := `<div><div class="active">content</div></div>`
	config := &ConstantConfig{
		Selector: []string{".active"},
		Constant: true,
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

	if result != true {
		t.Errorf("Expected true, got %v", result)
	}
}
