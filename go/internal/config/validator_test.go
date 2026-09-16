package config

import (
	"bytes"
	"errors"
	"os"
	"strings"
	"testing"
)

// TestSchemaMatchesTypeScript guards against the embedded schema drifting
// from the canonical copy in the TypeScript port.
func TestSchemaMatchesTypeScript(t *testing.T) {
	canonical, err := os.ReadFile("../../../typescript/src/config-schema.json")
	if err != nil {
		t.Fatalf("read canonical schema: %v", err)
	}

	if !bytes.Equal(canonical, schemaJSON) {
		t.Fatal("go/internal/config/config-schema.json differs from typescript/src/config-schema.json; copy it over")
	}
}

// Mirrors typescript/src/config-schema.test.ts.
func TestValidate(t *testing.T) {
	valid := []struct{ name, yaml string }{
		{"empty config", `{}`},
		{"string selector", `selector: .foo`},
		{"string array selector", `selector: [.foo]`},
		{"selector with sampleHTMLs", "selector:\n  selector: some selector\n  sampleHTMLs: [tests/fixtures/sample.html]"},
		{"selector object without selector", "selector:\n  sampleHTMLs: []"},
		{"empty selector object", `selector: {}`},
		{"number", "selector: .foo\ntype: number"},
		{"number with transform", "selector: .foo\ntype: number\ntransform: trim"},
		{"boolean", "selector: .foo\ntype: boolean"},
		{"boolean with transform", "selector: .foo\ntype: boolean\ntransform: trim"},
		{"object with explicit type", "selector: .foo\ntype: object\nproperties:\n  foo: { selector: .bar }"},
		{"object with implied type", "selector: .ttt\nproperties:\n  x: { selector: .foo }"},
		{"array with explicit type", "selector: .foo\ntype: array\nitems: { selector: .tt }"},
		{"transformer", "selector: .foo\ntransform: length"},
		{"transformer array", "selector: .foo\ntransform: [length, trim]"},
		{"transformer with bare args", "selector: a\ntransform: attr(href)"},
		{"transformer with quoted args", "selector: .foo\ntransform: 'replace(\"\\s+\", \" \")'"},
		{"default string", "selector: .foo\ndefault: unknown"},
		{"default zero", "selector: .foo\ndefault: 0"},
		{"default false", "selector: .foo\ndefault: false"},
		{"default null", "selector: .foo\ndefault: null"},
		{"default object", "selector: .foo\ndefault: { foo: bar }"},
		{"default array", "selector: .foo\ndefault: [foo]"},
		{"default on object", "selector: .foo\ntype: object\nproperties:\n  x: { selector: .x }\ndefault: {}"},
		{"default on array", "selector: .foo\nitems: { selector: .tt }\ndefault: []"},
		{"default on union", "union: [{ selector: .foo }]\ndefault: unknown"},
		{"default on constant", "selector: .foo\nconstant: bar\ndefault: unknown"},
		{"constant string", `constant: foo`},
		{"constant number", `constant: 123`},
		{"constant boolean", `constant: true`},
		{"constant object", `constant: { foo: bar }`},
		{"constant array", `constant: [foo]`},
	}

	invalid := []struct{ name, yaml string }{
		{"not an object", `123`},
		{"unknown property", `foo: bar`},
		{"empty string selector", `selector: ""`},
		{"empty selector array", `selector: []`},
		{"numeric selector", `selector: 123`},
		{"boolean selector", `selector: true`},
		{"unknown type", "selector: .foo\ntype: date"},
		{"number with properties", "selector: .foo\ntype: number\nproperties:\n  foo: { selector: .bar }"},
		{"number with items", "selector: .foo\ntype: number\nitems: { selector: .bar }"},
		{"properties with string type", "selector: .foo\ntype: string\nproperties:\n  foo: { selector: .bar }"},
		{"invalid property config", "properties:\n  x: 123"},
		{"object type without properties", "selector: .bar\ntype: object"},
		{"object with transform", "selector: .foo\nproperties:\n  x: { selector: .x }\ntransform: length"},
		{"items with string type", "selector: .foo\ntype: string\nitems: { selector: .tt }"},
		{"array type without items", "selector: .foo\ntype: array"},
		{"empty union", `union: []`},
		{"union with non-object", `union: [123]`},
		{"union with invalid config", `union: [{ selector: 123 }]`},
		{"union with extra props", "union: [{ selector: .foo }]\nselector: .bar"},
		{"numeric transform", "selector: .foo\ntransform: 123"},
		{"empty transform array", "selector: .foo\ntransform: []"},
		{"malformed transformer", "selector: .foo\ntransform: attr(href"},
		{"unquoted non-word arg", "selector: .foo\ntransform: split(::)"},
	}

	factory := NewConfigFactory()

	for _, tc := range valid {
		t.Run("valid/"+tc.name, func(t *testing.T) {
			if _, err := factory.FromYAML(tc.yaml); err != nil {
				t.Errorf("expected valid config, got: %v", err)
			}
		})
	}

	for _, tc := range invalid {
		t.Run("invalid/"+tc.name, func(t *testing.T) {
			_, err := factory.FromYAML(tc.yaml)
			var verr *ValidationError
			if !errors.As(err, &verr) {
				t.Errorf("expected *ValidationError, got: %v", err)
			}
		})
	}
}

func TestValidationErrorPointsAtOffendingField(t *testing.T) {
	_, err := NewConfigFactory().FromYAML("properties:\n  title:\n    selector: .title\n    transform: 123\n")
	if err == nil {
		t.Fatal("expected validation error")
	}

	if msg := err.Error(); !strings.Contains(msg, "/properties/title/transform") {
		t.Errorf("expected error to reference /properties/title/transform, got: %s", msg)
	}
}
