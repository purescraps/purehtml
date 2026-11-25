from selectolax.lexbor import LexborHTMLParser, LexborNode


class SelectolaxBackend:
    """
    A backend implementation using selectolax (Lexbor engine).

    Requires the optional dependency: ``pip install selectolax``.
    """

    @staticmethod
    def load(html):
        """
        Load an HTML string into a SelectolaxDocument.
        """
        return SelectolaxDocument(LexborHTMLParser(html))


class SelectolaxDocument:
    """
    A document implementation using selectolax.
    """

    def __init__(self, parser: LexborHTMLParser):
        self._parser = parser

    def select(self, selector):
        return [SelectolaxNode(el) for el in self._parser.css(selector)]

    def root(self):
        return SelectolaxNode(self._parser.root)


class SelectolaxNode:
    """
    A node implementation using selectolax.
    """

    def __init__(self, node: LexborNode):
        self._node = node

    def attr(self, name=None):
        attrs = self._node.attributes
        if name:
            value = attrs.get(name, None)
            # Valueless attributes (e.g. `disabled`) are None in selectolax.
            return "" if name in attrs and value is None else value

        return {k: "" if v is None else v for k, v in attrs.items()}

    def find(self, selector):
        return [SelectolaxNode(el) for el in self._node.css(selector)]

    def html(self):
        return self._node.inner_html

    def is_selector(self, selector):
        # Node.css_matches() also matches descendants, so check the node against
        # what its parent's subtree selects instead.
        parent = self._node.parent
        if parent is None:
            return False
        mem_id = self._node.mem_id
        return any(el.mem_id == mem_id for el in parent.css(selector))

    def text(self):
        return self._node.text(deep=True, separator="", strip=False)
