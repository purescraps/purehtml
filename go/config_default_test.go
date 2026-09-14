package purehtml

import (
	"testing"
)

func TestDefaultValueConfigReturnsDefaultWhenInnerResultIsNil(t *testing.T) {
	config := &DefaultValueConfig{
		Inner:   &PrimitiveValueConfig{Selector: []string{".nonexistent"}},
		Default: "unknown",
	}

	html := `<div><span class="foo">Hello</span></div>`
	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "unknown" {
		t.Errorf("Expected 'unknown', got %v", result)
	}
}

func TestDefaultValueConfigReturnsInnerResultWhenNotNil(t *testing.T) {
	config := &DefaultValueConfig{
		Inner:   &PrimitiveValueConfig{Selector: []string{".foo"}},
		Default: "unknown",
	}

	html := `<div><span class="foo">Hello</span></div>`
	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "Hello" {
		t.Errorf("Expected 'Hello', got %v", result)
	}
}

func TestDefaultValueConfigPassesThroughFalsyNonNilValues(t *testing.T) {
	html := `<div><span class="num">0</span><span class="empty"></span><span class="bool">false</span></div>`

	cases := []struct {
		name     string
		config   Config
		expected interface{}
	}{
		{
			name: "zero number",
			config: &DefaultValueConfig{
				Inner: &PrimitiveValueConfig{
					Selector:  []string{".num"},
					Transform: []TransformerSpec{{Name: "trim"}, {Name: "number"}},
				},
				Default: "unknown",
			},
			expected: 0.0,
		},
		{
			name: "empty string",
			config: &DefaultValueConfig{
				Inner: &PrimitiveValueConfig{
					Selector:  []string{".empty"},
					Transform: []TransformerSpec{{Name: "trim"}},
				},
				Default: "unknown",
			},
			expected: "",
		},
		{
			name: "false boolean",
			config: &DefaultValueConfig{
				Inner: &ConstantConfig{
					Selector: []string{".bool"},
					Constant: false,
				},
				Default: "unknown",
			},
			expected: false,
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			result, err := ExtractFromString(DefaultBackend, html, tc.config, "https://example.com")
			if err != nil {
				t.Fatalf("Failed to extract: %v", err)
			}

			if result != tc.expected {
				t.Errorf("Expected %v (%T), got %v (%T)", tc.expected, tc.expected, result, result)
			}
		})
	}
}

func TestDefaultValueConfigOnConstantConfig(t *testing.T) {
	config := &DefaultValueConfig{
		Inner: &ConstantConfig{
			Selector: []string{".nonexistent"},
			Constant: "actual",
		},
		Default: "unknown",
	}

	html := `<div><span class="foo">Hello</span></div>`
	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "unknown" {
		t.Errorf("Expected 'unknown', got %v", result)
	}
}

func TestDefaultValueConfigOnUnionConfig(t *testing.T) {
	config := &DefaultValueConfig{
		Inner: &UnionConfig{
			Configs: []Config{
				&PrimitiveValueConfig{Selector: []string{".missing-a"}},
				&PrimitiveValueConfig{Selector: []string{".missing-b"}},
			},
		},
		Default: "unknown",
	}

	html := `<div><span class="foo">Hello</span></div>`
	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "unknown" {
		t.Errorf("Expected 'unknown', got %v", result)
	}
}

func TestConfigFactoryParsesDefaultOnPrimitive(t *testing.T) {
	yaml := `
selector: .non-existing
default: unknown
`

	factory := NewConfigFactory()
	config, err := factory.FromYAML(yaml)
	if err != nil {
		t.Fatalf("Failed to parse YAML: %v", err)
	}

	defConfig, ok := config.(*DefaultValueConfig)
	if !ok {
		t.Fatalf("Expected *DefaultValueConfig, got %T", config)
	}

	if defConfig.Default != "unknown" {
		t.Errorf("Expected default 'unknown', got %v", defConfig.Default)
	}

	if _, ok := defConfig.Inner.(*PrimitiveValueConfig); !ok {
		t.Errorf("Expected inner *PrimitiveValueConfig, got %T", defConfig.Inner)
	}

	html := `<div><span class="foo">Hello</span></div>`
	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "unknown" {
		t.Errorf("Expected 'unknown', got %v", result)
	}
}

func TestConfigFactoryIgnoresDefaultWhenSelectorMatches(t *testing.T) {
	yaml := `
selector: .foo
default: unknown
`

	factory := NewConfigFactory()
	config, err := factory.FromYAML(yaml)
	if err != nil {
		t.Fatalf("Failed to parse YAML: %v", err)
	}

	html := `<div><span class="foo">Hello, purehtml</span></div>`
	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	if result != "Hello, purehtml" {
		t.Errorf("Expected 'Hello, purehtml', got %v", result)
	}
}

func TestConfigFactoryWithoutDefaultKeyDoesNotWrap(t *testing.T) {
	yaml := `selector: .foo`

	factory := NewConfigFactory()
	config, err := factory.FromYAML(yaml)
	if err != nil {
		t.Fatalf("Failed to parse YAML: %v", err)
	}

	if _, ok := config.(*DefaultValueConfig); ok {
		t.Errorf("Expected config to not be wrapped in *DefaultValueConfig when 'default' key is absent")
	}
}
