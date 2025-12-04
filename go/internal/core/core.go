package core

import (
	"fmt"
	"regexp"
)

// Backend is the interface for HTML parsing backends
type Backend interface {
	Load(html []byte) (Document, error)
}

// Document represents a parsed HTML document
type Document interface {
	Root() Node
	Query(selector string) []Node
}

// Node represents an HTML element node
type Node interface {
	Attr(name string) (string, bool)
	Attrs() map[string]string
	Find(selector string) []Node
	HTML() (string, bool)
	Is(selector string) bool
	Text() string
}

// PrimitiveType represents basic value types
type PrimitiveType string

const (
	STRING  PrimitiveType = "STRING"
	NUMBER  PrimitiveType = "NUMBER"
	BOOLEAN PrimitiveType = "BOOLEAN"
)

// ComplexType represents composite value types
type ComplexType string

const (
	OBJECT ComplexType = "OBJECT"
	ARRAY  ComplexType = "ARRAY"
)

// Property represents a path to a value in the output (symbol + string)
type Property struct {
	Type  string
	Value string
}

// Transformer is the interface for value transformation
type Transformer interface {
	GetName() string
	InputType() interface{}
	OutputType() interface{}
	Transform(value interface{}, params []string) (interface{}, error)
}

// BaseTransformer provides common transformer functionality
type BaseTransformer struct {
	Name       string
	InType     interface{}
	OutType    interface{}
	TransformFn func(value interface{}, params []string) (interface{}, error)
}

func (t *BaseTransformer) GetName() string            { return t.Name }
func (t *BaseTransformer) InputType() interface{}     { return t.InType }
func (t *BaseTransformer) OutputType() interface{}    { return t.OutType }
func (t *BaseTransformer) Transform(value interface{}, params []string) (interface{}, error) {
	return t.TransformFn(value, params)
}

// TransformerSpec represents a transformer with its parameters
type TransformerSpec struct {
	Name   string
	Params []string
}

// InvalidParseInputError is returned when parsing fails
type InvalidParseInputError struct {
	Message string
	Path    string
	Value   interface{}
	Err     error
}

func (e *InvalidParseInputError) Error() string {
	msg := e.Message
	if e.Path != "" {
		msg += fmt.Sprintf(" (path: %s)", e.Path)
	}
	if e.Value != nil {
		msg += fmt.Sprintf(" (value: %v)", e.Value)
	}
	if e.Err != nil {
		msg += fmt.Sprintf(": %v", e.Err)
	}
	return msg
}

// RegexCache for compiled regexes
var regexCache = make(map[string]*regexp.Regexp)

func GetRegex(pattern string) (*regexp.Regexp, error) {
	if r, ok := regexCache[pattern]; ok {
		return r, nil
	}
	r, err := regexp.Compile(pattern)
	if err != nil {
		return nil, err
	}
	regexCache[pattern] = r
	return r, nil
}
