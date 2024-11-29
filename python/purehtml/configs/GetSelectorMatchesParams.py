from bs4 import BeautifulSoup


class GetSelectorMatchesParams:
    """
    A concrete implementation of GetSelectorMatchesParams.
    """

    def __init__(self, already_matched: bool, include_root: bool, doc: BeautifulSoup):
        """
        Initializes the GetSelectorMatchesParams with required parameters.
        :param already_matched: Whether the selector is already matched.
        :param include_root: Whether the root element should be included.
        :param doc: The parsed HTML document as a BeautifulSoup object.
        """
        self._already_matched = already_matched
        self._include_root = include_root
        self._doc = doc

    def is_already_matched(self) -> bool:
        """
        Returns whether the selector is already matched.
        """
        return self._already_matched

    def is_include_root(self) -> bool:
        """
        Returns whether the root element should be included.
        """
        return self._include_root

    def doc(self) -> BeautifulSoup:
        """
        Returns the parsed HTML document as a BeautifulSoup object.
        """
        return self._doc