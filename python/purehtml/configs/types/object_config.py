from typing import Any
from typing import Dict
from typing import Optional

from purehtml.configs.configs import Config
from purehtml.configs.extract_params import ExtractParams
from purehtml.configs.selector_match_params import GetSelectorMatchesParams
from purehtml.configs.types.config_with_selector import ConfigWithSelector


class ObjectConfig(ConfigWithSelector):
    """
    Concrete class representing an object configuration with selector and properties.
    """

    def __init__(self, selector: Optional[str], properties: Dict[str, Config]):
        """
        Initializes the ObjectConfig with a selector and properties map.
        :param selector: The selector string.
        :param properties: A dictionary mapping property names to Config objects.
        """
        super().__init__()
        self.selector = selector
        self.properties = properties

    def set_properties(self, properties: Dict[str, Config]):
        """
        Set the properties for this object configuration.
        :param properties: A dictionary mapping property names to Config objects.
        """
        self.properties = properties

    def extract(self, params: ExtractParams) -> Any:
        """
        Extract values for each property based on the provided parameters.
        :param params: The ExtractParams object containing context for extraction.
        :return: A dictionary of extracted property values.
        """

        parent = params.node()
        selector_params = GetSelectorMatchesParams(
            already_matched=params.get_element_already_matched() or False,
            include_root=False,
        )

        element = self.get_first_match(parent, selector_params, params.document())
        if not element and self.selector:
            return None

        props = self.properties
        result = {}

        for key in props:
            config = props[key]
            extract_params = ExtractParams(document=params.document(),
                                           nodes=[element],
                                           url=params.url(),
                                           element_already_matched=False)

            result[key] = config.extract(extract_params)

        return result
