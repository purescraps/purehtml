from bs4 import BeautifulSoup, Tag  # Using BeautifulSoup for HTML parsing
from typing import List, Optional


class ExtractParams:
    """
    Concrete implementation of the abstract ExtractParams class.
    """

    def __init__(
        self,
        document: BeautifulSoup,
        node: List[Tag],
        url: str,
        element_already_matched: bool,
        element: Optional[Tag],
    ):
        self._document = document
        self._node = node
        self._url = url
        self._element_already_matched = element_already_matched
        self._element = element

    def document(self) -> BeautifulSoup:
        return self._document

    def node(self) -> List[Tag]:
        return self._node

    def url(self) -> str:
        return self._url

    def get_element_already_matched(self) -> bool:
        return self._element_already_matched

    def element(self) -> Optional[Tag]:
        return self._element