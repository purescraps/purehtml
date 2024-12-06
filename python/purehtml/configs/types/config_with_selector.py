from abc import ABC
from typing import Any
from typing import List
from typing import Optional
from typing import Union

from purehtml.backend.backend import PureHTMLDocument
from purehtml.backend.backend import PureHTMLNode
from purehtml.configs.configs import Config


class ConfigWithSelector(Config, ABC):

    def __init__(self, selector: Optional[str] = None):
        """
        Initialize ConfigWithSelector with an optional CSS selector.
        :param selector: The CSS selector to use for matching.
        """
        super().__init__()
        self.selector = selector

    def get_all_matches(self, element: List, params: Any, doc: PureHTMLDocument) \
            -> List[PureHTMLNode]:
        """
                Get the all matches according to below conditions. It will return the given
                element if it is already matched, no selector is provided.
                """

        if self.selector is None:
            # If no selector is provided, return the element as is.
            return element

        if params.is_already_matched():
            return element

        if params.is_include_root():
            if len(element) == 0:
                root = doc.select(self.selector)

                for nod in root:
                    if nod.is_selector(self.selector):
                        return [nod]

                    else:
                        return root
            else:
                for node in element:
                    if node.is_selector(self.selector):
                        return [node]
                return []

        if len(element) == 0:

            nodes = doc.select(self.selector)
            results = []

            for node in nodes:

                if params.is_include_root():
                    results.extend(node.find(self.selector))

            return results if params.is_include_root() else nodes

        else:
            nodes = element[0].find(self.selector)
            return nodes

    def get_first_match(self,
                        element: Union[List[PureHTMLNode], PureHTMLNode],
                        params: Any,
                        doc: PureHTMLDocument) \
            -> Optional[PureHTMLNode]:
        """
        Get the first match for the selector.
        """
        matches = self.get_all_matches(element, params, doc)
        if matches:
            return matches[0]
        return None
