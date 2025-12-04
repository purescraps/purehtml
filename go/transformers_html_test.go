package purehtml

import (
	"strings"
	"testing"
)

func TestHtmlTransformerExtractsInnerHTML(t *testing.T) {
	html := `<div class="container"><span>nested</span> content</div>`

	config := &PrimitiveValueConfig{
		Selector: []string{".container"},
		Transform: []TransformerSpec{
			{Name: "html"},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	resultStr, ok := result.(string)
	if !ok {
		t.Fatalf("Expected string, got %T", result)
	}

	// Check that the inner HTML contains the span and content
	if !strings.Contains(resultStr, "nested") || !strings.Contains(resultStr, "content") {
		t.Errorf("Expected inner HTML to contain 'nested' and 'content', got %q", resultStr)
	}
}

func TestHtmlTransformerPreservesHTMLStructure(t *testing.T) {
	html := `<article>
		<h1>Title</h1>
		<p>Paragraph</p>
	</article>`

	config := &PrimitiveValueConfig{
		Selector: []string{"article"},
		Transform: []TransformerSpec{
			{Name: "html"},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	resultStr, ok := result.(string)
	if !ok {
		t.Fatalf("Expected string, got %T", result)
	}

	// Check that HTML structure is preserved
	if !strings.Contains(resultStr, "<h1>") || !strings.Contains(resultStr, "<p>") {
		t.Errorf("Expected HTML structure preserved, got %q", resultStr)
	}

	if !strings.Contains(resultStr, "Title") || !strings.Contains(resultStr, "Paragraph") {
		t.Errorf("Expected content preserved, got %q", resultStr)
	}
}

func TestHtmlTransformerWithEmptyElement(t *testing.T) {
	html := `<div class="empty"></div>`

	config := &PrimitiveValueConfig{
		Selector: []string{".empty"},
		Transform: []TransformerSpec{
			{Name: "html"},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	resultStr, ok := result.(string)
	if !ok {
		t.Fatalf("Expected string, got %T", result)
	}

	// Empty element should return empty HTML
	if resultStr != "" && strings.TrimSpace(resultStr) != "" {
		t.Errorf("Expected empty HTML, got %q", resultStr)
	}
}

func TestHtmlTransformerWithNestedTags(t *testing.T) {
	html := `<div class="parent">
		<div class="child">
			<span class="grandchild">Text</span>
		</div>
	</div>`

	config := &PrimitiveValueConfig{
		Selector: []string{".parent"},
		Transform: []TransformerSpec{
			{Name: "html"},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	resultStr, ok := result.(string)
	if !ok {
		t.Fatalf("Expected string, got %T", result)
	}

	// Should contain all nested elements
	if !strings.Contains(resultStr, "child") || !strings.Contains(resultStr, "grandchild") || !strings.Contains(resultStr, "Text") {
		t.Errorf("Expected nested elements in HTML, got %q", resultStr)
	}
}

func TestHtmlTransformerInArray(t *testing.T) {
	html := `
	<div class="items">
		<div class="item"><b>Item 1</b></div>
		<div class="item"><b>Item 2</b></div>
		<div class="item"><b>Item 3</b></div>
	</div>
	`

	config := &ArrayConfig{
		Selector: []string{".item"},
		Items: &PrimitiveValueConfig{
			Transform: []TransformerSpec{
				{Name: "html"},
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

	if len(results) != 3 {
		t.Errorf("Expected 3 results, got %d", len(results))
	}

	// Each result should be HTML containing <b>Item N</b>
	for i, item := range results {
		itemStr, ok := item.(string)
		if !ok {
			t.Errorf("Result[%d]: Expected string, got %T", i, item)
		}
		if !strings.Contains(itemStr, "<b>") && !strings.Contains(itemStr, "Item") {
			t.Errorf("Result[%d]: Expected HTML with 'Item', got %q", i, itemStr)
		}
	}
}

func TestHtmlTransformerWithSpecialCharacters(t *testing.T) {
	html := `<div class="special">
		<span>&amp; &lt; &gt; &quot;</span>
	</div>`

	config := &PrimitiveValueConfig{
		Selector: []string{".special"},
		Transform: []TransformerSpec{
			{Name: "html"},
		},
	}

	result, err := ExtractFromString(DefaultBackend, html, config, "https://example.com")
	if err != nil {
		t.Fatalf("Failed to extract: %v", err)
	}

	resultStr, ok := result.(string)
	if !ok {
		t.Fatalf("Expected string, got %T", result)
	}

	// Should contain the span element
	if !strings.Contains(resultStr, "span") {
		t.Errorf("Expected HTML with span tag, got %q", resultStr)
	}
}
