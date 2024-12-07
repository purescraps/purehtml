class GetSelectorMatchesParams:
    """
    A concrete implementation of GetSelectorMatchesParams.
    """

    def __init__(self, already_matched: bool, include_root: bool):
        """
        Initializes the GetSelectorMatchesParams with required parameters.
        :param already_matched: Whether the selector is already matched.
        :param include_root: Whether the root element should be included.
        """
        self._already_matched = already_matched
        self._include_root = include_root

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
