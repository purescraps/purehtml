from abc import ABC
from typing import Any, List, Optional, Union

import bs4

from purehtml.backend.backend import PureHTMLDocument, PureHTMLNode
from purehtml.configs.configs import Config
from purehtml.configs.selector_match_params import GetSelectorMatchesParams


class ConfigWithSelector(Config, ABC):

    def __init__(self, selector: Optional[str] = None):
        """
        Initialize ConfigWithSelector with an optional CSS selector.
        :param selector: The CSS selector to use for matching.
        """
        super().__init__()
        self.selector = selector

    def get_all_matches(
        self, element: List, params: Any, doc: PureHTMLDocument
    ) -> List[PureHTMLNode]:
        """
        Get the all matches according to below conditions. It will return the given
        element if it is already matched, no selector is provided.
        """

        if self.selector is None:
            # If no selector is provided, return the element as is.
            return element

        if params.is_already_matched():
            return element

        if len(element) == 0:
            return doc.select(self.selector)

        if params.is_include_root():
            matching = [node for node in element if node.is_selector(self.selector)]
            if len(matching) > 0:
                return matching

        results = []
        for node in element:
            results.extend(node.find(self.selector))
        return results

    def get_first_match(
        self,
        element: Union[List[PureHTMLNode], PureHTMLNode],
        params: GetSelectorMatchesParams,
        doc: PureHTMLDocument,
    ) -> Optional[PureHTMLNode]:
        """
        Get the first match for the selector.
        """
        matches = self.get_all_matches(element, params, doc)

        if len(matches) > 0:
            return matches[0]

        return None
