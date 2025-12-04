package config

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/purescraps/purehtml/go/internal/core"
	"github.com/purescraps/purehtml/go/internal/transformer"
)

// Config is the interface for extraction configuration
type Config interface {
	Extract(backend core.Backend, node core.Node, url string, path string) (interface{}, error)
}

// ConfigWithSelector is a base config with CSS selector support
type ConfigWithSelector interface {
	Config
	GetSelector() []string
	GetTransform() []core.TransformerSpec
}

// PrimitiveValueConfig extracts a single value
type PrimitiveValueConfig struct {
	Selector  []string
	Transform []core.TransformerSpec
}

func (c *PrimitiveValueConfig) GetSelector() []string {
	return c.Selector
}

func (c *PrimitiveValueConfig) GetTransform() []core.TransformerSpec {
	return c.Transform
}

func (c *PrimitiveValueConfig) Extract(backend core.Backend, node core.Node, url string, path string) (interface{}, error) {
	if len(c.Selector) == 0 {
		return nil, &core.InvalidParseInputError{
			Message: "primitive config requires a selector",
			Path:    path,
		}
	}

	var value core.Node = node
	for _, selector := range c.Selector {
		// First check if the current node itself matches the selector
		if value.Is(selector) {
			// Node matches, use it
		} else {
			// Otherwise try to find a descendant that matches
			matches := value.Find(selector)
			if len(matches) == 0 {
				return nil, nil
			}
			value = matches[0]
		}
	}

	var currentValue interface{} = value

	// Apply transformers
	for i, spec := range c.Transform {
		trans := transformer.GetTransformer(spec.Name)
		if trans == nil {
			return nil, &core.InvalidParseInputError{
				Message: fmt.Sprintf("unknown transformer: %s", spec.Name),
				Path:    path,
			}
		}

		// For the first transformer, if we have a node, we need to decide what to pass
		// Some transformers (attr, html, text) work on nodes
		// Others (trim, number, etc.) work on strings
		var transformInput interface{} = currentValue
		if i == 0 {
			if nodeVal, isNode := currentValue.(core.Node); isNode {
				// Check transformer name to see if it expects a node
				transformerName := spec.Name
				if transformerName == "attr" || transformerName == "html" || transformerName == "text" {
					transformInput = nodeVal
				} else {
					// Extract text from node for other transformers
					transformInput = nodeVal.Text()
				}
			}
		}

		var err error
		currentValue, err = trans.Transform(transformInput, spec.Params)
		if err != nil {
			return nil, &core.InvalidParseInputError{
				Message: err.Error(),
				Path:    path,
				Value:   currentValue,
			}
		}
	}

	// If we still have a node (no transformers applied), extract its text
	if node, isNode := currentValue.(core.Node); isNode {
		return node.Text(), nil
	}

	return currentValue, nil
}

// ObjectConfig extracts an object with properties
type ObjectConfig struct {
	Selector   []string
	Properties map[string]Config
	Transform  []core.TransformerSpec
}

func (c *ObjectConfig) GetSelector() []string {
	return c.Selector
}

func (c *ObjectConfig) GetTransform() []core.TransformerSpec {
	return c.Transform
}

func (c *ObjectConfig) Extract(backend core.Backend, node core.Node, url string, path string) (interface{}, error) {
	// Navigate to target node if selector is specified
	if len(c.Selector) > 0 {
		matches := node.Find(strings.Join(c.Selector, " "))
		if len(matches) == 0 {
			return make(map[string]interface{}), nil
		}
		node = matches[0]
	}

	result := make(map[string]interface{})

	// Extract each property
	for propName, propConfig := range c.Properties {
		propPath := path
		if path != "" {
			propPath = path + "." + propName
		} else {
			propPath = propName
		}

		val, err := propConfig.Extract(backend, node, url, propPath)
		if err != nil {
			return nil, err
		}
		result[propName] = val
	}

	// Apply transformers to the object
	var value interface{} = result
	for _, spec := range c.Transform {
		trans := transformer.GetTransformer(spec.Name)
		if trans == nil {
			return nil, &core.InvalidParseInputError{
				Message: fmt.Sprintf("unknown transformer: %s", spec.Name),
				Path:    path,
			}
		}

		var err error
		value, err = trans.Transform(value, spec.Params)
		if err != nil {
			return nil, &core.InvalidParseInputError{
				Message: err.Error(),
				Path:    path,
				Value:   value,
			}
		}
	}

	return value, nil
}

// ArrayConfig extracts an array of items
type ArrayConfig struct {
	Selector  []string
	Items     Config
	Transform []core.TransformerSpec
}

func (c *ArrayConfig) GetSelector() []string {
	return c.Selector
}

func (c *ArrayConfig) GetTransform() []core.TransformerSpec {
	return c.Transform
}

func (c *ArrayConfig) Extract(backend core.Backend, node core.Node, url string, path string) (interface{}, error) {
	if len(c.Selector) == 0 {
		return nil, &core.InvalidParseInputError{
			Message: "array config requires a selector",
			Path:    path,
		}
	}

	matches := node.Find(strings.Join(c.Selector, " "))
	if len(matches) == 0 {
		return []interface{}{}, nil
	}

	var result []interface{}
	for i, match := range matches {
		itemPath := path + "[" + strconv.Itoa(i) + "]"

		// If Items config is a PrimitiveValueConfig without selector, apply transformers directly to node
		if primConfig, ok := c.Items.(*PrimitiveValueConfig); ok && len(primConfig.Selector) == 0 {
			var currentValue interface{} = match
			var isNode = true

			for j, spec := range primConfig.Transform {
				trans := transformer.GetTransformer(spec.Name)
				if trans == nil {
					return nil, &core.InvalidParseInputError{
						Message: fmt.Sprintf("unknown transformer: %s", spec.Name),
						Path:    itemPath,
					}
				}

				// For the first transformer, if we have a node, decide what to pass
				var transformInput interface{} = currentValue
				if j == 0 && isNode {
					nodeVal, ok := currentValue.(core.Node)
					if ok {
						// Check transformer name to see if it expects a node
						if spec.Name == "attr" || spec.Name == "html" || spec.Name == "text" {
							transformInput = nodeVal
						} else {
							// Extract text from node for other transformers
							transformInput = nodeVal.Text()
						}
					}
				}

				var err error
				currentValue, err = trans.Transform(transformInput, spec.Params)
				if err != nil {
					return nil, &core.InvalidParseInputError{
						Message: err.Error(),
						Path:    itemPath,
						Value:   currentValue,
					}
				}
				isNode = false
			}

			// If no transformers were applied and we still have a node, extract its text
			if isNode && len(primConfig.Transform) == 0 {
				if node, ok := currentValue.(core.Node); ok {
					currentValue = node.Text()
				}
			}

			result = append(result, currentValue)
		} else {
			val, err := c.Items.Extract(backend, match, url, itemPath)
			if err != nil {
				return nil, err
			}
			result = append(result, val)
		}
	}

	// Apply transformers
	var value interface{} = result
	for _, spec := range c.Transform {
		trans := transformer.GetTransformer(spec.Name)
		if trans == nil {
			return nil, &core.InvalidParseInputError{
				Message: fmt.Sprintf("unknown transformer: %s", spec.Name),
				Path:    path,
			}
		}

		var err error
		value, err = trans.Transform(value, spec.Params)
		if err != nil {
			return nil, &core.InvalidParseInputError{
				Message: err.Error(),
				Path:    path,
				Value:   value,
			}
		}
	}

	return value, nil
}

// ConstantConfig returns a constant value
type ConstantConfig struct {
	Selector []string
	Constant interface{}
}

func (c *ConstantConfig) GetSelector() []string {
	return c.Selector
}

func (c *ConstantConfig) GetTransform() []core.TransformerSpec {
	return []core.TransformerSpec{}
}

func (c *ConstantConfig) Extract(backend core.Backend, node core.Node, url string, path string) (interface{}, error) {
	// Return constant only if selector matches
	if len(c.Selector) > 0 {
		if !node.Is(strings.Join(c.Selector, " ")) {
			matches := node.Find(strings.Join(c.Selector, " "))
			if len(matches) == 0 {
				return nil, nil
			}
		}
	}
	return c.Constant, nil
}

// UnionConfig tries multiple configs
type UnionConfig struct {
	Configs []Config
}

func (c *UnionConfig) Extract(backend core.Backend, node core.Node, url string, path string) (interface{}, error) {
	for _, config := range c.Configs {
		val, err := config.Extract(backend, node, url, path)
		if err != nil {
			// If this config errored, try next
			continue
		}

		// If value is not nil, return it
		if val != nil {
			return val, nil
		}
	}
	return nil, nil
}
