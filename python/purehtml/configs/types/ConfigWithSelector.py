from abc import ABC
from typing import Any, Optional, Union, List

from bs4 import Tag

from purehtml.configs.Configs import Config


class ConfigWithSelector(Config, ABC):

    def __init__(self, selector: Optional[str] = None):
        """
        Initialize ConfigWithSelector with an optional CSS selector.
        :param selector: The CSS selector to use for matching.
        """
        super().__init__()
        self.selector = selector

    def get_all_matches(
        self, elements: Optional[List[Tag]], params: Any
    ) -> Optional[Union[List[Tag], Tag]]:
        """
        Get all matches based on the selector and parameters.
        :param elements: The current list of elements (or None).
        :param params: An object implementing GetSelectorMatchesParams.
        :return: A list of matching elements or None if no matches.
        """
        if params.is_already_matched():
            return elements

        if self.selector is None:
            return elements

        if elements is None and params.is_include_root():
            elements = params.doc().select(self.selector)
            if elements:
                return elements
            return None

        if params.is_include_root() and elements is not None:
            if any(element.select_one(self.selector) for element in elements):
                return elements

        # Use the document to select new elements with the selector
        return params.doc().select(self.selector)

    def get_first(self, elements: Optional[List[Tag]], params: Any) -> Optional[Tag]:
        """
        Get the first matching element.
        :param elements: The current list of elements (or None).
        :param params: An object implementing GetSelectorMatchesParams.
        :return: The first matching element or None.
        """
        matches = self.get_all_matches(elements, params)
        if matches and isinstance(matches, list):
            return matches[0]  # Return the first element in the list
        return matches
