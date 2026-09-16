package config

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/santhosh-tekuri/jsonschema/v6"
)

// schemaJSON is a verbatim copy of typescript/src/config-schema.json, the
// schema every port validates against. Go's embed cannot reach outside the
// module, so the file is duplicated here; TestSchemaMatchesTypeScript keeps
// the two copies in sync.
//
//go:embed config-schema.json
var schemaJSON []byte

// schemaURL is the base URL the schema is registered under. The schema's
// relative "$id" and recursive "$ref": "config-schema.json" both resolve
// against it.
const schemaURL = "https://purehtml.local/config-schema.json"

var configSchema = mustCompileSchema()

func mustCompileSchema() *jsonschema.Schema {
	doc, err := jsonschema.UnmarshalJSON(bytes.NewReader(schemaJSON))
	if err != nil {
		panic(fmt.Sprintf("purehtml: invalid embedded config schema: %v", err))
	}

	compiler := jsonschema.NewCompiler()
	if err := compiler.AddResource(schemaURL, doc); err != nil {
		panic(fmt.Sprintf("purehtml: cannot load embedded config schema: %v", err))
	}

	schema, err := compiler.Compile(schemaURL)
	if err != nil {
		panic(fmt.Sprintf("purehtml: cannot compile embedded config schema: %v", err))
	}

	return schema
}

// ValidationError reports a config that does not conform to the config schema.
type ValidationError struct {
	Cause *jsonschema.ValidationError
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("invalid config: %v", e.Cause)
}

func (e *ValidationError) Unwrap() error {
	return e.Cause
}

// Validate checks a decoded YAML config (as produced by yaml.Unmarshal into
// an interface{}) against the shared config schema.
func Validate(plain interface{}) error {
	// Round-trip through JSON so the instance only contains JSON value types
	// (map[string]any, []any, json.Number, ...) regardless of how the YAML
	// decoder represented numbers.
	data, err := json.Marshal(plain)
	if err != nil {
		return fmt.Errorf("invalid config: %w", err)
	}

	instance, err := jsonschema.UnmarshalJSON(bytes.NewReader(data))
	if err != nil {
		return fmt.Errorf("invalid config: %w", err)
	}

	if err := configSchema.Validate(instance); err != nil {
		if verr, ok := err.(*jsonschema.ValidationError); ok {
			return &ValidationError{Cause: verr}
		}
		return fmt.Errorf("invalid config: %w", err)
	}

	return nil
}
