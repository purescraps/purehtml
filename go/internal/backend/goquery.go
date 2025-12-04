package backend

import (
	"bytes"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/purescraps/purehtml/go/internal/core"
)

// GoQueryBackend implements core.Backend using goquery
type GoQueryBackend struct{}

// Load parses HTML and returns a Document
func (b *GoQueryBackend) Load(html []byte) (core.Document, error) {
	doc, err := goquery.NewDocumentFromReader(bytes.NewReader(html))
	if err != nil {
		return nil, err
	}
	return &goQueryDocument{doc: doc}, nil
}

type goQueryDocument struct {
	doc *goquery.Document
}

func (d *goQueryDocument) Root() core.Node {
	return &goQueryNode{sel: d.doc.Selection}
}

func (d *goQueryDocument) Query(selector string) []core.Node {
	var nodes []core.Node
	d.doc.Find(selector).Each(func(_ int, s *goquery.Selection) {
		nodes = append(nodes, &goQueryNode{sel: s})
	})
	return nodes
}

type goQueryNode struct {
	sel *goquery.Selection
}

func (n *goQueryNode) Attr(name string) (string, bool) {
	val, exists := n.sel.Attr(name)
	return val, exists
}

func (n *goQueryNode) Attrs() map[string]string {
	attrs := make(map[string]string)
	for _, attr := range n.sel.Nodes[0].Attr {
		attrs[attr.Key] = attr.Val
	}
	return attrs
}

func (n *goQueryNode) Find(selector string) []core.Node {
	var nodes []core.Node
	n.sel.Find(selector).Each(func(_ int, s *goquery.Selection) {
		nodes = append(nodes, &goQueryNode{sel: s})
	})
	return nodes
}

func (n *goQueryNode) HTML() (string, bool) {
	html, err := n.sel.Html()
	if err != nil {
		return "", false
	}
	return html, html != ""
}

func (n *goQueryNode) Is(selector string) bool {
	return n.sel.Is(selector)
}

func (n *goQueryNode) Text() string {
	return strings.TrimSpace(n.sel.Text())
}

// NewGoQueryBackend creates a new GoQuery backend
func NewGoQueryBackend() *GoQueryBackend {
	return &GoQueryBackend{}
}
