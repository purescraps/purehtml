package purehtml

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"gopkg.in/yaml.v3"
)

// TestSpec represents a single test case from the spec files
type TestSpec struct {
	Description   string      `yaml:"description"`
	Input         string      `yaml:"input"`
	Configuration interface{} `yaml:"configuration"`
	Expected      interface{} `yaml:"expected"`
}

// SpecFile represents a parsed spec file
type SpecFile struct {
	Description string      `yaml:"description"`
	Specs       []TestSpec  `yaml:"specs"`
}

// LoadSpecFile loads and parses a YAML spec file
func LoadSpecFile(filePath string) (*SpecFile, error) {
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	var spec SpecFile
	err = yaml.Unmarshal(data, &spec)
	if err != nil {
		return nil, err
	}

	return &spec, nil
}

// LoadAllSpecs recursively loads all spec files from a directory
func LoadAllSpecs(dirPath string) ([]*SpecFile, error) {
	var specs []*SpecFile

	err := filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() {
			ext := strings.ToLower(filepath.Ext(path))
			if ext == ".yaml" || ext == ".yml" {
				spec, err := LoadSpecFile(path)
				if err != nil {
					return fmt.Errorf("failed to load spec file %s: %w", path, err)
				}
				specs = append(specs, spec)
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return specs, nil
}

// ConfigFactoryFromMap creates a config from a map interface
func ConfigFactoryFromMap(data interface{}) (Config, error) {
	// Convert the data to YAML string and back to normalize it
	yamlData, err := yaml.Marshal(data)
	if err != nil {
		return nil, err
	}

	factory := NewConfigFactory()
	return factory.FromYAML(string(yamlData))
}

// deepEqual compares two interface{} values recursively
func deepEqual(a, b interface{}) bool {
	// Handle nil cases
	if a == nil && b == nil {
		return true
	}
	if a == nil || b == nil {
		return false
	}

	// Convert to string for comparison if they're simple types
	switch av := a.(type) {
	case map[string]interface{}:
		bv, ok := b.(map[string]interface{})
		if !ok {
			return false
		}
		if len(av) != len(bv) {
			return false
		}
		for k, v := range av {
			if !deepEqual(v, bv[k]) {
				return false
			}
		}
		return true

	case []interface{}:
		bv, ok := b.([]interface{})
		if !ok {
			return false
		}
		if len(av) != len(bv) {
			return false
		}
		for i, v := range av {
			if !deepEqual(v, bv[i]) {
				return false
			}
		}
		return true

	case float64:
		// Handle numeric comparison (YAML parses numbers as float64)
		// but expected might be int or float
		switch bv := b.(type) {
		case float64:
			return av == bv
		case int:
			return av == float64(bv)
		default:
			return false
		}

	case string:
		bv, ok := b.(string)
		return ok && av == bv

	case bool:
		bv, ok := b.(bool)
		return ok && av == bv

	default:
		return fmt.Sprintf("%v", a) == fmt.Sprintf("%v", b)
	}
}

// getSpecsDir finds the specs directory
func getSpecsDir(t *testing.T) string {
	// The specs directory is at /Users/fatih/dev/kisisel/purehtml/specs
	// Our Go module is at /Users/fatih/dev/kisisel/purehtml/go
	// So we go up one level from current working directory or from this file location
	cwd, err := os.Getwd()
	if err != nil {
		t.Fatalf("Failed to get current working directory: %v", err)
	}

	// Try specs relative to the parent of the go directory
	specsPath := filepath.Join(filepath.Dir(cwd), "specs")
	if _, err := os.Stat(specsPath); err == nil {
		return specsPath
	}

	// Try from the git root
	specsPath = filepath.Join(cwd, "..", "specs")
	if _, err := os.Stat(specsPath); err == nil {
		return specsPath
	}

	// Try absolute path
	specsPath = "/Users/fatih/dev/kisisel/purehtml/specs"
	if _, err := os.Stat(specsPath); err == nil {
		return specsPath
	}

	t.Fatalf("Could not find specs directory")
	return ""
}

// TestAllSpecs runs all specification tests
func TestAllSpecs(t *testing.T) {
	specsDir := getSpecsDir(t)
	specs, err := LoadAllSpecs(specsDir)
	if err != nil {
		t.Fatalf("Failed to load specs: %v", err)
	}

	if len(specs) == 0 {
		t.Fatal("No spec files found")
	}

	testCount := 0
	failCount := 0

	for _, specFile := range specs {
		t.Run(specFile.Description, func(t *testing.T) {
			for _, testCase := range specFile.Specs {
				testCount++
				t.Run(testCase.Description, func(t *testing.T) {
					// Parse configuration
					config, err := ConfigFactoryFromMap(testCase.Configuration)
					if err != nil {
						t.Errorf("Failed to create config: %v", err)
						failCount++
						return
					}

					// Extract data
					result, err := ExtractFromString(DefaultBackend, testCase.Input, config, "http://example.com")
					if err != nil {
						t.Errorf("Failed to extract: %v", err)
						failCount++
						return
					}

					// Compare results
					if !deepEqual(result, testCase.Expected) {
						t.Errorf("Result mismatch.\nExpected: %v (%T)\nGot: %v (%T)",
							testCase.Expected, testCase.Expected,
							result, result)
						failCount++
						return
					}
				})
			}
		})
	}

	t.Logf("Ran %d tests, %d failed", testCount, failCount)
	if failCount > 0 {
		t.Fatalf("%d tests failed", failCount)
	}
}
