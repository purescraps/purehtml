from abc import ABC


from typing import Any, Optional, List, Union

from purehtml.backend.backend import PureHTMLDocument, PureHTMLNode
from purehtml.configs.Configs import Config


class ConfigWithSelector(Config, ABC):

    def __init__(self, selector: Optional[str] = None):
        """
        Initialize ConfigWithSelector with an optional CSS selector.
        :param selector: The CSS selector to use for matching.
        """
        super().__init__()
        self.selector = selector

    def get_all_matches(self, element, params: Any, doc : PureHTMLDocument) \
            -> List[PureHTMLNode]:

        if self.selector is None:
            # If no selector is provided, return the element as is.
            return element

        if isinstance(element, list):
            # Process each element in the list and collect all matches
            matches = []
            for el in element:
                matches.extend(self._get_matches_for_single_node(el, params, doc))

            return matches

        else:
            # Handle a single node
            return self._get_matches_for_single_node(element, params, doc)


    def get_first_match(self, element : Union[List[PureHTMLNode], PureHTMLNode],
                        params: Any, doc : PureHTMLDocument) \
                        -> Optional[PureHTMLNode]:
        """
        Get the first match for the selector.
        Handles both single nodes and lists of nodes.
        """

        if isinstance(element, List):

            if len(element) == 0: # if list is empty

                matches = self._get_matches_for_single_node(None, params, doc)

                if matches:
                    return matches[0]  # Return the first match if found
                else:
                    return None

            else:
                # Iterate over each node in the list and get the first match
                matches = []
                for el in element:

                    matches = self._get_matches_for_single_node(el, params, doc)

                if matches:
                    return matches[0]  # Return the first match if found
                else:
                    return None

        else:
            # Handle a Non List
            matches = self._get_matches_for_single_node(element, params, doc)
            return matches[0] if matches else None


    def _get_matches_for_single_node(self, node : Optional[PureHTMLNode],
                                     params : Any, doc : PureHTMLDocument) \
                                     -> List[PureHTMLNode]:
        """
        Helper method to get matches for a single node.
        """

        if params.is_already_matched():
            return [node]

        if self.selector is None:
            return [node]

        if params.is_include_root():

            if node is None:
                root = doc.select(self.selector)

                for nod in root:

                    if nod.is_selector(self.selector):
                        return [nod]

                    else:
                        return root
            else:
                if node.is_selector(self.selector):
                    return [node]

        # get new nodes with selector from Document
        if node is None:

            nodes = doc.select(self.selector)
            results = []

            for node in nodes:

                if params.is_include_root():
                    results.extend(node.find(self.selector))

            return results if params.is_include_root() else nodes

        else:
            nodes = node.find(self.selector)

            return nodes


