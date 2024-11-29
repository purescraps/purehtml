from typing import Any, Optional

from purehtml.configs.GetSelectorMatchesParams import GetSelectorMatchesParams


# Assuming ConfigWithSelector and ExtractParams are already defined
class ConfigWithSelector:
    def get_all_matches(self, node: Any, params: Any) -> Optional[Any]:
        """
        Placeholder for get_all_matches. This should be implemented.
        """
        pass


class ConstantConfig(ConfigWithSelector):
    def __init__(self, val: Any, selector: Optional[str]):
        """
        Initialize ConstantConfig with a value and an optional selector.
        :param val: The constant value to be returned.
        :param selector: The CSS selector to match nodes.
        """
        super().__init__()
        self.val = val
        self.selector = selector

    def extract(self, params: Any) -> Optional[str]:
        """
        Extracts data based on the selector and parameters provided.
        :param params: An object implementing ExtractParams interface.
        :return: A JSON string of the value or None if no match is found.
        """
        if self.selector is not None:
            # Create a local equivalent of GetSelectorMatchesParams
            selector_params = GetSelectorMatchesParams(False, True, params.document())

            # Attempt to get matches using the selector
            matches = self.get_all_matches(params.node(), selector_params)
            if matches is None:
                return None

            # Convert value to JSON string
            return self.val

        # Default return if no selector
        return self.val
