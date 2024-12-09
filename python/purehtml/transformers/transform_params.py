from typing import Any

from bs4 import Tag  # Assuming bs4 is used for the Element equivalent in Python

from purehtml.backend.backend import PureHTMLNode


class TransformParams:
    def __init__(self, val: Any, element: PureHTMLNode, url: str):
        """
        Initialize TransformParams with value, element, and URL.
        :param val: The value to be transformed (can be any type).
        :param element: The BeautifulSoup Tag object representing the HTML element.
        :param url: The URL from which the element originated.
        """
        self.val = val
        self.element = element
        self.url = url

    # Getters and Setters
    def get_val(self) -> Any:
        return self.val

    def set_val(self, val: Any) -> None:
        self.val = val

    def get_element(self) -> PureHTMLNode:
        return self.element

    def set_element(self, element: Tag) -> None:
        self.element = element

    def get_url(self) -> str:
        return self.url
