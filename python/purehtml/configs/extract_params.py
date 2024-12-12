from typing import List

from purehtml.backend.backend import PureHTMLDocument
from purehtml.backend.backend import PureHTMLNode


class ExtractParams:
    """
    Implementation of the ExtractParams Class. It is used by configs for extraction.
    """

    def __init__(
            self,
            document: PureHTMLDocument,
            nodes: List[PureHTMLNode],
            url: str,
            element_already_matched: bool,

    ):
        self._document = document
        self._nodes = nodes
        self._url = url
        self._element_already_matched = element_already_matched

    def document(self) -> PureHTMLDocument:
        return self._document

    def node(self) -> List[PureHTMLNode]:
        return self._nodes

    def url(self) -> str:
        return self._url

    def get_element_already_matched(self) -> bool:
        return self._element_already_matched
