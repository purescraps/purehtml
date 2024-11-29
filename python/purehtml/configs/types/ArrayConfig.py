from typing import List

from purehtml.configs.ExtractParams import ExtractParams
from purehtml.configs.ExtractParamsBuilder import ExtractParamsBuilder
from purehtml.configs.GetSelectorMatchesParams import GetSelectorMatchesParams
from purehtml.configs.Configs import Config
from purehtml.configs.types.ConfigWithSelector import ConfigWithSelector
from purehtml.configs.types.PrimitiveValueConfig import PrimitiveValueConfig
from purehtml.configs.types.UnionConfig import UnionConfig
from purehtml.transformers.Transformer import Transformer


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

    def extract(self, params: ExtractParams) -> str:
        """
        Extract values from the array based on the provided parameters.
        :param params: The ExtractParams object containing context for extraction.
        :return: A list of extracted values.
        """
        # Get all matches for the element
        selector_params = GetSelectorMatchesParams(
            already_matched=params.get_element_already_matched(),
            include_root=False,
            doc=params.document()
        )
        elements = self.get_all_matches(params.node(), selector_params)

        # Ensure elements is a list, even if there's only one element
        matches = elements if isinstance(elements, list) else [elements]

        # Use the provided `items` config, or a default primitive config
        conf = self.items if self.items is not None else PrimitiveValueConfig(None, self.transform)

        result = []
        # this could be better with configs instead of elements
        for el in matches:

            # Build extract parameters
            extract_params = ExtractParamsBuilder() \
                .set_document(params.document()) \
                .set_node(params.node()) \
                .set_url(params.url()) \
                .set_element_already_matched(params.get_element_already_matched()) \
                .set_element(el) \
                .build()

            # Extract the value
            result.append(conf.extract(extract_params))

            # If items is an instance of UnionConfig, return the result immediately
            if isinstance(self.items, UnionConfig):
                return str(result[0])
        return str(result)