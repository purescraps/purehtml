from bs4 import BeautifulSoup, Tag  # Using BeautifulSoup for HTML parsing
from typing import List, Optional

from purehtml.configs.ExtractParams import ExtractParams


class ExtractParamsBuilder:
    """
    Builder class to construct ExtractParams instances easily.
    """

    def __init__(self):
        self._document: Optional[BeautifulSoup] = None
        self._node: Optional[List[Tag]] = None
        self._url: Optional[str] = None
        self._element_already_matched: bool = False
        self._element: Optional[Tag] = None

    def set_document(self, document: BeautifulSoup) -> 'ExtractParamsBuilder':
        self._document = document
        return self

    def set_node(self, node: List[Tag]) -> 'ExtractParamsBuilder':
        self._node = node
        return self

    def set_url(self, url: str) -> 'ExtractParamsBuilder':
        self._url = url
        return self

    def set_element_already_matched(self, matched: bool) -> 'ExtractParamsBuilder':
        self._element_already_matched = matched
        return self

    def set_element(self, element: Optional[Tag]) -> 'ExtractParamsBuilder':
        self._element = element
        return self

    def build(self) -> ExtractParams:
        if self._document is None:
            raise ValueError("Document must be set.")
        if self._url is None:
            raise ValueError("URL must be set.")
        if self._node is None:
            self._node = []  # Default to an empty list if nodes are not provided

        return ExtractParams(
            document=self._document,
            node=self._node,
            url=self._url,
            element_already_matched=self._element_already_matched,
            element=self._element,
        )