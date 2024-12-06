from typing import Any
from typing import List

from purehtml.configs.configs import Config
from purehtml.configs.extract_params import ExtractParams
from purehtml.configs.selector_match_params import GetSelectorMatchesParams
from purehtml.configs.types.config_with_selector import ConfigWithSelector
from purehtml.configs.types.primitive_value_config import PrimitiveValueConfig
from purehtml.transformers.transformer import Transformer


class ArrayConfig(ConfigWithSelector):
    """
    Concrete class representing an array configuration with selector and transformers.
    """

    def __init__(self, selector: str, items: Config, transform: List[Transformer]):
        """
        Initializes the ArrayConfig with selector, item config, and transformers.
        :param selector: The selector string.
        :param items: The configuration for the items in the array.
        :param transform: A list of transformers to apply.
        """
        super().__init__()
        self.selector = selector
        self.items = items
        self.transform = transform

    def extract(self, params: ExtractParams) -> Any:
        """
        Extract values from the array based on the provided parameters.
        :param params: The ExtractParams object containing context for extraction.
        :return: A list of extracted values.
        """
        # Get all matches for the element

        selector_params = GetSelectorMatchesParams(
            already_matched=params.get_element_already_matched() or False,
            include_root=False
        )

        elements = self.get_all_matches(params.node(), selector_params, params.document())

        # Use the provided `items` config, or a default primitive config
        conf = self.items if self.items is not None else PrimitiveValueConfig(None, self.transform)

        result = []

        for el in elements:
            extract_params = ExtractParams(document=params.document(),
                                           nodes=[el],
                                           url=params.url(),
                                           element_already_matched=params.get_element_already_matched())

            # Extract the value
            result.append(conf.extract(extract_params))

        return result
