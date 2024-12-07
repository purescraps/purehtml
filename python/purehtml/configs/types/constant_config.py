from typing import Any
from typing import Optional

from purehtml.configs.selector_match_params import GetSelectorMatchesParams
from purehtml.configs.types.config_with_selector import ConfigWithSelector


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
            selector_params = GetSelectorMatchesParams(False, True)

            # Attempt to get matches using the selector
            matches = self.get_all_matches(params.node(), selector_params, params.document)
            if matches is None:
                return None

            return self.val

        # Default return if no selector
        return self.val
