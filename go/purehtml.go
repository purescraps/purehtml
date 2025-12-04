package purehtml

import (
	"github.com/purescraps/purehtml/go/internal/backend"
	"github.com/purescraps/purehtml/go/internal/config"
	"github.com/purescraps/purehtml/go/internal/core"
	"github.com/purescraps/purehtml/go/internal/transformer"
)

// Re-export core types
type Backend = core.Backend
type Document = core.Document
type Node = core.Node
type Transformer = core.Transformer
type BaseTransformer = core.BaseTransformer
type TransformerSpec = core.TransformerSpec
type InvalidParseInputError = core.InvalidParseInputError
type PrimitiveType = core.PrimitiveType
type ComplexType = core.ComplexType

// Re-export core constants
const (
	STRING  = core.STRING
	NUMBER  = core.NUMBER
	BOOLEAN = core.BOOLEAN
	OBJECT  = core.OBJECT
	ARRAY   = core.ARRAY
)

// Re-export config types
type Config = config.Config
type PrimitiveValueConfig = config.PrimitiveValueConfig
type ObjectConfig = config.ObjectConfig
type ArrayConfig = config.ArrayConfig
type ConstantConfig = config.ConstantConfig
type UnionConfig = config.UnionConfig
type ConfigFactory = config.ConfigFactory

// Extract extracts data from HTML according to a config
func Extract(backend Backend, html []byte, cfg Config, baseURL string) (interface{}, error) {
	doc, err := backend.Load(html)
	if err != nil {
		return nil, err
	}

	root := doc.Root()
	return cfg.Extract(backend, root, baseURL, "")
}

// ExtractFromString is a convenience function that accepts HTML as a string
func ExtractFromString(backend Backend, html string, cfg Config, baseURL string) (interface{}, error) {
	return Extract(backend, []byte(html), cfg, baseURL)
}

// Default backend instance
var DefaultBackend = backend.NewGoQueryBackend()

// NewConfigFactory creates a new ConfigFactory
func NewConfigFactory() *ConfigFactory {
	return config.NewConfigFactory()
}

// Transformer constructor functions
func NewTrimTransformer() *transformer.TrimTransformer {
	return transformer.NewTrimTransformer()
}

func NewNumberTransformer() *transformer.NumberTransformer {
	return transformer.NewNumberTransformer()
}

func NewAttrTransformer() *transformer.AttrTransformer {
	return transformer.NewAttrTransformer()
}

func NewHtmlTransformer() *transformer.HtmlTransformer {
	return transformer.NewHtmlTransformer()
}

func NewTextTransformer() *transformer.TextTransformer {
	return transformer.NewTextTransformer()
}

func NewExistsTransformer() *transformer.ExistsTransformer {
	return transformer.NewExistsTransformer()
}

func NewLengthTransformer() *transformer.LengthTransformer {
	return transformer.NewLengthTransformer()
}

func NewJsonTransformer() *transformer.JsonTransformer {
	return transformer.NewJsonTransformer()
}

func NewResolveTransformer() *transformer.ResolveTransformer {
	return transformer.NewResolveTransformer()
}

func NewUrlQueryParamTransformer() *transformer.UrlQueryParamTransformer {
	return transformer.NewUrlQueryParamTransformer()
}

func NewRemoveUrlQueryParamTransformer() *transformer.RemoveUrlQueryParamTransformer {
	return transformer.NewRemoveUrlQueryParamTransformer()
}

func NewRemoveLastPathSectionTransformer() *transformer.RemoveLastPathSectionTransformer {
	return transformer.NewRemoveLastPathSectionTransformer()
}

// GetTransformer gets a transformer by name
func GetTransformer(name string) Transformer {
	return transformer.GetTransformer(name)
}
