package transformer

import (
	"encoding/json"
	"fmt"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"unicode"

	"github.com/purescraps/purehtml/go/internal/core"
)

// TrimTransformer removes leading/trailing whitespace
type TrimTransformer struct {
	core.BaseTransformer
}

func NewTrimTransformer() *TrimTransformer {
	return &TrimTransformer{
		core.BaseTransformer{
			Name:   "trim",
			InType: core.STRING,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				str, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("trim: expected string, got %T", value)
				}
				return strings.TrimSpace(str), nil
			},
		},
	}
}

// NumberTransformer converts string to number
type NumberTransformer struct {
	core.BaseTransformer
}

func NewNumberTransformer() *NumberTransformer {
	return &NumberTransformer{
		core.BaseTransformer{
			Name:   "number",
			InType: core.STRING,
			OutType: core.NUMBER,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				str, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("number: expected string, got %T", value)
				}
				num, err := strconv.ParseFloat(str, 64)
				if err != nil {
					return nil, fmt.Errorf("number: failed to parse '%s': %w", str, err)
				}
				return num, nil
			},
		},
	}
}

// AttrTransformer extracts attribute values
type AttrTransformer struct {
	core.BaseTransformer
}

func NewAttrTransformer() *AttrTransformer {
	return &AttrTransformer{
		core.BaseTransformer{
			Name:   "attr",
			InType: nil, // Can work on nodes
			OutType: nil, // Can return string or object
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				node, ok := value.(core.Node)
				if !ok {
					return nil, fmt.Errorf("attr: expected Node, got %T", value)
				}

				// If no parameters, return all attributes as object
				if len(params) == 0 {
					return node.Attrs(), nil
				}

				// Otherwise return specific attribute
				attrName := params[0]
				val, exists := node.Attr(attrName)
				if !exists {
					return "", nil
				}
				return val, nil
			},
		},
	}
}

// HtmlTransformer extracts inner HTML
type HtmlTransformer struct {
	core.BaseTransformer
}

func NewHtmlTransformer() *HtmlTransformer {
	return &HtmlTransformer{
		core.BaseTransformer{
			Name:   "html",
			InType: nil,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				node, ok := value.(core.Node)
				if !ok {
					return nil, fmt.Errorf("html: expected Node, got %T", value)
				}
				html, _ := node.HTML()
				return html, nil
			},
		},
	}
}

// TextTransformer extracts text content
type TextTransformer struct {
	core.BaseTransformer
}

func NewTextTransformer() *TextTransformer {
	return &TextTransformer{
		core.BaseTransformer{
			Name:   "text",
			InType: nil,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				node, ok := value.(core.Node)
				if !ok {
					return nil, fmt.Errorf("text: expected Node, got %T", value)
				}
				return node.Text(), nil
			},
		},
	}
}

// ExistsTransformer checks if value exists
type ExistsTransformer struct {
	core.BaseTransformer
}

func NewExistsTransformer() *ExistsTransformer {
	return &ExistsTransformer{
		core.BaseTransformer{
			Name:   "exists",
			InType: core.STRING,
			OutType: core.BOOLEAN,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				str, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("exists: expected string, got %T", value)
				}
				return str != "", nil
			},
		},
	}
}

// LengthTransformer gets length of string or array
type LengthTransformer struct {
	core.BaseTransformer
}

func NewLengthTransformer() *LengthTransformer {
	return &LengthTransformer{
		core.BaseTransformer{
			Name:   "length",
			InType: nil,
			OutType: core.NUMBER,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				switch v := value.(type) {
				case string:
					return float64(len(v)), nil
				case []interface{}:
					return float64(len(v)), nil
				default:
					return nil, fmt.Errorf("length: expected string or array, got %T", value)
				}
			},
		},
	}
}

// JsonTransformer parses JSON
type JsonTransformer struct {
	core.BaseTransformer
}

func NewJsonTransformer() *JsonTransformer {
	return &JsonTransformer{
		core.BaseTransformer{
			Name:   "json",
			InType: core.STRING,
			OutType: nil, // Can return any type
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				str, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("json: expected string, got %T", value)
				}
				var result interface{}
				err := json.Unmarshal([]byte(str), &result)
				if err != nil {
					return nil, fmt.Errorf("json: failed to parse JSON: %w", err)
				}
				return result, nil
			},
		},
	}
}

// ResolveTransformer resolves relative URLs
type ResolveTransformer struct {
	core.BaseTransformer
}

func NewResolveTransformer() *ResolveTransformer {
	return &ResolveTransformer{
		core.BaseTransformer{
			Name:   "resolve",
			InType: core.STRING,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				if len(params) == 0 {
					return nil, fmt.Errorf("resolve: requires base URL parameter")
				}
				baseURLStr := params[0]
				relURL, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("resolve: expected string, got %T", value)
				}

				baseURL, err := url.Parse(baseURLStr)
				if err != nil {
					return nil, fmt.Errorf("resolve: invalid base URL: %w", err)
				}

				relParsed, err := url.Parse(relURL)
				if err != nil {
					return nil, fmt.Errorf("resolve: invalid relative URL: %w", err)
				}

				resolved := baseURL.ResolveReference(relParsed)
				return resolved.String(), nil
			},
		},
	}
}

// UrlQueryParamTransformer extracts URL query parameters
type UrlQueryParamTransformer struct {
	core.BaseTransformer
}

func NewUrlQueryParamTransformer() *UrlQueryParamTransformer {
	return &UrlQueryParamTransformer{
		core.BaseTransformer{
			Name:   "urlQueryParam",
			InType: core.STRING,
			OutType: nil, // Can return string or object
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				if len(params) == 0 {
					return nil, fmt.Errorf("urlQueryParam: requires at least one parameter name")
				}
				urlStr, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("urlQueryParam: expected string, got %T", value)
				}

				parsed, err := url.Parse(urlStr)
				if err != nil {
					return nil, fmt.Errorf("urlQueryParam: invalid URL: %w", err)
				}

				query := parsed.Query()
				if len(params) == 1 {
					return query.Get(params[0]), nil
				}

				result := make(map[string]interface{})
				for _, param := range params {
					result[param] = query.Get(param)
				}
				return result, nil
			},
		},
	}
}

// RemoveUrlQueryParamTransformer removes URL query parameters
type RemoveUrlQueryParamTransformer struct {
	core.BaseTransformer
}

func NewRemoveUrlQueryParamTransformer() *RemoveUrlQueryParamTransformer {
	return &RemoveUrlQueryParamTransformer{
		core.BaseTransformer{
			Name:   "removeUrlQueryParam",
			InType: core.STRING,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				urlStr, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("removeUrlQueryParam: expected string, got %T", value)
				}

				parsed, err := url.Parse(urlStr)
				if err != nil {
					return nil, fmt.Errorf("removeUrlQueryParam: invalid URL: %w", err)
				}

				query := parsed.Query()

				// If no params given, clear all query params
				if len(params) == 0 {
					parsed.RawQuery = ""
				} else {
					// Remove specified parameters
					for _, param := range params {
						query.Del(param)
					}
					parsed.RawQuery = query.Encode()
				}

				return parsed.String(), nil
			},
		},
	}
}

// RemoveLastPathSectionTransformer removes last path section from URL
type RemoveLastPathSectionTransformer struct {
	core.BaseTransformer
}

func NewRemoveLastPathSectionTransformer() *RemoveLastPathSectionTransformer {
	return &RemoveLastPathSectionTransformer{
		core.BaseTransformer{
			Name:   "removeLastPathSection",
			InType: core.STRING,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				urlStr, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("removeLastPathSection: expected string, got %T", value)
				}

				parsed, err := url.Parse(urlStr)
				if err != nil {
					return nil, fmt.Errorf("removeLastPathSection: invalid URL: %w", err)
				}

				path := parsed.Path

				if path == "" {
					// No path, set to root
					parsed.Path = "/"
					return parsed.String(), nil
				}

				if path == "/" {
					// Already at root, return as-is
					return parsed.String(), nil
				}

				// Remove trailing slash if present
				if strings.HasSuffix(path, "/") {
					path = path[:len(path)-1]
				}

				// Find last slash
				lastSlash := strings.LastIndex(path, "/")
				if lastSlash > 0 {
					path = path[:lastSlash]
				} else if lastSlash == 0 {
					// Only slash is at the beginning, set to root
					path = "/"
				}

				parsed.Path = path

				return parsed.String(), nil
			},
		},
	}
}

// ReplaceTransformer performs a regex/string substitution
type ReplaceTransformer struct {
	core.BaseTransformer
}

func NewReplaceTransformer() *ReplaceTransformer {
	return &ReplaceTransformer{
		core.BaseTransformer{
			Name:    "replace",
			InType:  core.STRING,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				str, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("replace: expected string, got %T", value)
				}
				if len(params) < 2 {
					return nil, fmt.Errorf(`replace: requires a pattern and a replacement, e.g. replace("\d+", "#")`)
				}

				re, err := regexp.Compile(params[0])
				if err != nil {
					return nil, fmt.Errorf("replace: invalid pattern %q: %w", params[0], err)
				}

				return re.ReplaceAllString(str, params[1]), nil
			},
		},
	}
}

// SplitTransformer splits a string into an array
type SplitTransformer struct {
	core.BaseTransformer
}

func NewSplitTransformer() *SplitTransformer {
	return &SplitTransformer{
		core.BaseTransformer{
			Name:    "split",
			InType:  core.STRING,
			OutType: core.ARRAY,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				str, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("split: expected string, got %T", value)
				}

				var parts []string
				if len(params) == 0 {
					// No delimiter given: split on runs of whitespace, like
					// Python's str.split().
					parts = strings.Fields(str)
				} else {
					parts = strings.Split(str, params[0])
				}

				result := make([]interface{}, len(parts))
				for i, p := range parts {
					result[i] = p
				}
				return result, nil
			},
		},
	}
}

// JoinTransformer joins an array of values into a string
type JoinTransformer struct {
	core.BaseTransformer
}

func NewJoinTransformer() *JoinTransformer {
	return &JoinTransformer{
		core.BaseTransformer{
			Name:    "join",
			InType:  core.ARRAY,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				items, ok := value.([]interface{})
				if !ok {
					return nil, fmt.Errorf("join: expected array, got %T", value)
				}

				delimiter := ""
				if len(params) > 0 {
					delimiter = params[0]
				}

				strs := make([]string, len(items))
				for i, item := range items {
					strs[i] = fmt.Sprintf("%v", item)
				}
				return strings.Join(strs, delimiter), nil
			},
		},
	}
}

// LowerTransformer lowercases a string
type LowerTransformer struct {
	core.BaseTransformer
}

func NewLowerTransformer() *LowerTransformer {
	return &LowerTransformer{
		core.BaseTransformer{
			Name:    "lower",
			InType:  core.STRING,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				str, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("lower: expected string, got %T", value)
				}
				return strings.ToLower(str), nil
			},
		},
	}
}

// UpperTransformer uppercases a string
type UpperTransformer struct {
	core.BaseTransformer
}

func NewUpperTransformer() *UpperTransformer {
	return &UpperTransformer{
		core.BaseTransformer{
			Name:    "upper",
			InType:  core.STRING,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				str, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("upper: expected string, got %T", value)
				}
				return strings.ToUpper(str), nil
			},
		},
	}
}

// CapitalizeTransformer uppercases the first character of a string and
// lowercases the rest
type CapitalizeTransformer struct {
	core.BaseTransformer
}

func NewCapitalizeTransformer() *CapitalizeTransformer {
	return &CapitalizeTransformer{
		core.BaseTransformer{
			Name:    "capitalize",
			InType:  core.STRING,
			OutType: core.STRING,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				str, ok := value.(string)
				if !ok {
					return nil, fmt.Errorf("capitalize: expected string, got %T", value)
				}
				if str == "" {
					return str, nil
				}

				lower := []rune(strings.ToLower(str))
				lower[0] = unicode.ToUpper(lower[0])
				return string(lower), nil
			},
		},
	}
}

// BooleanTransformer explicitly casts a value to a boolean using generic
// truthy semantics
type BooleanTransformer struct {
	core.BaseTransformer
}

func NewBooleanTransformer() *BooleanTransformer {
	return &BooleanTransformer{
		core.BaseTransformer{
			Name:    "boolean",
			InType:  nil,
			OutType: core.BOOLEAN,
			TransformFn: func(value interface{}, params []string) (interface{}, error) {
				return isTruthy(value), nil
			},
		},
	}
}

// isTruthy applies generic truthy-cast semantics: nil, false, 0, "", and
// empty arrays/objects are falsy; everything else is truthy.
func isTruthy(value interface{}) bool {
	switch v := value.(type) {
	case nil:
		return false
	case bool:
		return v
	case string:
		return v != ""
	case float64:
		return v != 0
	case int:
		return v != 0
	case []interface{}:
		return len(v) > 0
	case map[string]interface{}:
		return len(v) > 0
	default:
		return true
	}
}

// TransformerRegistry holds all available transformers
var transformerRegistry = map[string]func() core.Transformer{
	"trim":                   func() core.Transformer { return NewTrimTransformer() },
	"number":                 func() core.Transformer { return NewNumberTransformer() },
	"attr":                   func() core.Transformer { return NewAttrTransformer() },
	"html":                   func() core.Transformer { return NewHtmlTransformer() },
	"text":                   func() core.Transformer { return NewTextTransformer() },
	"exists":                 func() core.Transformer { return NewExistsTransformer() },
	"length":                 func() core.Transformer { return NewLengthTransformer() },
	"json":                   func() core.Transformer { return NewJsonTransformer() },
	"resolve":                func() core.Transformer { return NewResolveTransformer() },
	"urlQueryParam":          func() core.Transformer { return NewUrlQueryParamTransformer() },
	"removeUrlQueryParam":    func() core.Transformer { return NewRemoveUrlQueryParamTransformer() },
	"removeLastPathSection":  func() core.Transformer { return NewRemoveLastPathSectionTransformer() },
	"replace":                func() core.Transformer { return NewReplaceTransformer() },
	"split":                  func() core.Transformer { return NewSplitTransformer() },
	"join":                   func() core.Transformer { return NewJoinTransformer() },
	"lower":                  func() core.Transformer { return NewLowerTransformer() },
	"upper":                  func() core.Transformer { return NewUpperTransformer() },
	"capitalize":             func() core.Transformer { return NewCapitalizeTransformer() },
	"boolean":                func() core.Transformer { return NewBooleanTransformer() },
}

// GetTransformer gets a transformer by name
func GetTransformer(name string) core.Transformer {
	if fn, ok := transformerRegistry[name]; ok {
		return fn()
	}
	return nil
}

// GetAllTransformers returns all registered transformers
func GetAllTransformers() []core.Transformer {
	var transformers []core.Transformer
	for _, fn := range transformerRegistry {
		transformers = append(transformers, fn())
	}
	return transformers
}
