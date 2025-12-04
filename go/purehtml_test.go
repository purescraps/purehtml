package purehtml

import (
	"testing"
)

func TestExtractPrimitive(t *testing.T) {
	html := []byte(`<html><body><div class="title">Hello World</div></body></html>`)

	config := &PrimitiveValueConfig{
		Selector:  []string{".title"},
		Transform: []TransformerSpec{{Name: "trim"}},
	}

	result, err := Extract(DefaultBackend, html, config, "")
	if err != nil {
		t.Fatalf("Extract failed: %v", err)
	}

	expected := "Hello World"
	if result != expected {
		t.Errorf("Expected %q, got %q", expected, result)
	}
}

func TestExtractObject(t *testing.T) {
	html := []byte(`
	<html>
		<body>
			<div class="title">Hello</div>
			<div class="desc">World</div>
		</body>
	</html>
	`)

	config := &ObjectConfig{
		Selector: []string{"body"},
		Properties: map[string]Config{
			"title": &PrimitiveValueConfig{
				Selector:  []string{".title"},
				Transform: []TransformerSpec{{Name: "trim"}},
			},
			"desc": &PrimitiveValueConfig{
				Selector:  []string{".desc"},
				Transform: []TransformerSpec{{Name: "trim"}},
			},
		},
	}

	result, err := Extract(DefaultBackend, html, config, "")
	if err != nil {
		t.Fatalf("Extract failed: %v", err)
	}

	resultMap, ok := result.(map[string]interface{})
	if !ok {
		t.Fatalf("Expected map, got %T", result)
	}

	if resultMap["title"] != "Hello" {
		t.Errorf("Expected title 'Hello', got %q", resultMap["title"])
	}

	if resultMap["desc"] != "World" {
		t.Errorf("Expected desc 'World', got %q", resultMap["desc"])
	}
}

func TestExtractArray(t *testing.T) {
	html := []byte(`
	<html>
		<body>
			<ul>
				<li>Item 1</li>
				<li>Item 2</li>
				<li>Item 3</li>
			</ul>
		</body>
	</html>
	`)

	config := &ArrayConfig{
		Selector: []string{"li"},
		Items: &PrimitiveValueConfig{
			Transform: []TransformerSpec{{Name: "trim"}},
		},
	}

	result, err := Extract(DefaultBackend, html, config, "")
	if err != nil {
		t.Fatalf("Extract failed: %v", err)
	}

	resultArr, ok := result.([]interface{})
	if !ok {
		t.Fatalf("Expected []interface{}, got %T", result)
	}

	if len(resultArr) != 3 {
		t.Errorf("Expected 3 items, got %d", len(resultArr))
	}

	if resultArr[0] != "Item 1" {
		t.Errorf("Expected 'Item 1', got %q", resultArr[0])
	}
}

func TestTrimTransformer(t *testing.T) {
	transformer := NewTrimTransformer()
	result, err := transformer.Transform("  hello world  ", []string{})
	if err != nil {
		t.Fatalf("Transform failed: %v", err)
	}
	if result != "hello world" {
		t.Errorf("Expected 'hello world', got %q", result)
	}
}

func TestNumberTransformer(t *testing.T) {
	transformer := NewNumberTransformer()
	result, err := transformer.Transform("123.45", []string{})
	if err != nil {
		t.Fatalf("Transform failed: %v", err)
	}
	if result != 123.45 {
		t.Errorf("Expected 123.45, got %v", result)
	}
}

func TestConfigFactoryPrimitive(t *testing.T) {
	yamlStr := `
selector: .title
transform: trim
`

	factory := NewConfigFactory()
	config, err := factory.FromYAML(yamlStr)
	if err != nil {
		t.Fatalf("FromYAML failed: %v", err)
	}

	_, ok := config.(*PrimitiveValueConfig)
	if !ok {
		t.Errorf("Expected *PrimitiveValueConfig, got %T", config)
	}
}

func TestConfigFactoryObject(t *testing.T) {
	yamlStr := `
selector: body
properties:
  title:
    selector: .title
    transform: trim
  desc:
    selector: .desc
`

	factory := NewConfigFactory()
	config, err := factory.FromYAML(yamlStr)
	if err != nil {
		t.Fatalf("FromYAML failed: %v", err)
	}

	objConfig, ok := config.(*ObjectConfig)
	if !ok {
		t.Errorf("Expected *ObjectConfig, got %T", config)
	}

	if len(objConfig.Properties) != 2 {
		t.Errorf("Expected 2 properties, got %d", len(objConfig.Properties))
	}
}

func TestConfigFactoryArray(t *testing.T) {
	yamlStr := `
selector: li
type: array
items:
  transform: trim
`

	factory := NewConfigFactory()
	config, err := factory.FromYAML(yamlStr)
	if err != nil {
		t.Fatalf("FromYAML failed: %v", err)
	}

	_, ok := config.(*ArrayConfig)
	if !ok {
		t.Errorf("Expected *ArrayConfig, got %T", config)
	}
}
