package config

import (
	"fmt"

	"github.com/purescraps/purehtml/go/internal/core"
	"gopkg.in/yaml.v3"
)

// PlainConfig represents the raw YAML structure
type PlainConfig struct {
	Selector   interface{}            `yaml:"selector"`
	Properties map[string]interface{} `yaml:"properties"`
	Type       string                 `yaml:"type"`
	Items      interface{}            `yaml:"items"`
	Transform  interface{}            `yaml:"transform"`
	Constant   interface{}            `yaml:"constant"`
	Union      interface{}            `yaml:"union"`
}

// ConfigFactory creates Config objects from YAML
type ConfigFactory struct{}

// FromYAML parses YAML and returns a Config
func (f *ConfigFactory) FromYAML(yamlStr string) (Config, error) {
	var plain interface{}
	err := yaml.Unmarshal([]byte(yamlStr), &plain)
	if err != nil {
		return nil, fmt.Errorf("yaml parse error: %w", err)
	}

	config, err := f.parseConfig(plain, "")
	if err != nil {
		return nil, err
	}

	return config, nil
}

func (f *ConfigFactory) parseConfig(data interface{}, path string) (Config, error) {
	m, ok := data.(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("config must be an object at path %s", path)
	}

	// Check for constant config
	if constant, ok := m["constant"]; ok {
		return &ConstantConfig{
			Selector: f.parseSelector(m["selector"]),
			Constant: constant,
		}, nil
	}

	// Check for union config
	if union, ok := m["union"]; ok {
		unionConfigs, err := f.parseUnion(union, path)
		if err != nil {
			return nil, err
		}
		return &UnionConfig{Configs: unionConfigs}, nil
	}

	selector := f.parseSelector(m["selector"])
	transform := f.parseTransform(m["transform"])

	// Check for items - if items exist, it's an array config (regardless of type field)
	if m["items"] != nil {
		itemsConfig, err := f.parseConfig(m["items"], path+"[]")
		if err != nil {
			return nil, err
		}
		return &ArrayConfig{
			Selector:  selector,
			Items:     itemsConfig,
			Transform: transform,
		}, nil
	}

	// Check for array config with type: array
	if configType, ok := m["type"]; ok && configType == "array" {
		return nil, fmt.Errorf("array config requires 'items' at path %s", path)
	}

	// Check for object config (has properties)
	if properties, ok := m["properties"]; ok {
		propsMap, ok := properties.(map[string]interface{})
		if !ok {
			return nil, fmt.Errorf("properties must be an object at path %s", path)
		}

		propConfigs := make(map[string]Config)
		for propName, propData := range propsMap {
			propConfig, err := f.parseConfig(propData, path+"."+propName)
			if err != nil {
				return nil, err
			}
			propConfigs[propName] = propConfig
		}

		return &ObjectConfig{
			Selector:   selector,
			Properties: propConfigs,
			Transform:  transform,
		}, nil
	}

	// Check for type: object
	if configType, ok := m["type"]; ok && configType == "object" {
		return &ObjectConfig{
			Selector:   selector,
			Properties: make(map[string]Config),
			Transform:  transform,
		}, nil
	}

	// Default: primitive value config
	return &PrimitiveValueConfig{
		Selector:  selector,
		Transform: transform,
	}, nil
}

func (f *ConfigFactory) parseSelector(selectorData interface{}) []string {
	if selectorData == nil {
		return []string{}
	}

	switch v := selectorData.(type) {
	case string:
		return []string{v}
	case []interface{}:
		var result []string
		for _, item := range v {
			if str, ok := item.(string); ok {
				result = append(result, str)
			}
		}
		return result
	default:
		return []string{}
	}
}

func (f *ConfigFactory) parseTransform(transformData interface{}) []core.TransformerSpec {
	if transformData == nil {
		return []core.TransformerSpec{}
	}

	switch v := transformData.(type) {
	case string:
		return f.parseTransformerString(v)
	case []interface{}:
		var result []core.TransformerSpec
		for _, item := range v {
			if str, ok := item.(string); ok {
				result = append(result, f.parseTransformerString(str)...)
			}
		}
		return result
	default:
		return []core.TransformerSpec{}
	}
}

func (f *ConfigFactory) parseTransformerString(spec string) []core.TransformerSpec {
	// Parse transformer name and parameters
	// Format: "name(param1, param2)" or just "name"
	var name string
	var params string

	for i, ch := range spec {
		if ch == '(' {
			name = spec[:i]
		} else if ch == ')' {
			params = spec[len(name)+1 : i]
		}
	}

	if name == "" {
		name = spec
	}

	var paramList []string
	if params != "" {
		// Split by comma and trim whitespace
		parts := make([]string, 0)
		current := ""
		for _, ch := range params {
			if ch == ',' {
				parts = append(parts, current)
				current = ""
			} else {
				current += string(ch)
			}
		}
		if current != "" {
			parts = append(parts, current)
		}

		for _, p := range parts {
			trimmed := ""
			inStr := false
			for _, ch := range p {
				if ch == ' ' && !inStr {
					continue
				}
				inStr = true
				trimmed += string(ch)
			}
			paramList = append(paramList, trimmed)
		}
	}

	return []core.TransformerSpec{{Name: name, Params: paramList}}
}

func (f *ConfigFactory) parseUnion(unionData interface{}, path string) ([]Config, error) {
	list, ok := unionData.([]interface{})
	if !ok {
		return nil, fmt.Errorf("union must be an array at path %s", path)
	}

	var configs []Config
	for i, item := range list {
		config, err := f.parseConfig(item, path+"["+fmt.Sprintf("%d", i)+"]")
		if err != nil {
			return nil, err
		}
		configs = append(configs, config)
	}

	return configs, nil
}

// NewConfigFactory creates a new ConfigFactory
func NewConfigFactory() *ConfigFactory {
	return &ConfigFactory{}
}
