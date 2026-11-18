from typing import Any
from typing import List

from purehtml.configs.configs import Config
from purehtml.configs.extract_params import ExtractParams
from purehtml.configs.selector_match_params import GetSelectorMatchesParams
from purehtml.configs.types.config_with_selector import ConfigWithSelector
from purehtml.configs.types.constant_config import ConstantConfig


class UnionConfig(Config):
    def __init__(self, configs: List[Config]):
        """
        Initializes the UnionConfig with a list of Config objects.
        :param configs: List of Config objects.
        """
        super().__init__()
        self.configs = configs

    def extract(self, params: ExtractParams) -> Any:
        """
        Extracts values from the list of configs based on provided parameters.
        :param params: The ExtractParams object containing context for extraction.
        :return: A string representation of the extracted values.
        """

        parent_element = params.node()

        for config in self.configs:

            if isinstance(config, ConfigWithSelector):
                selector_params = GetSelectorMatchesParams(
                    already_matched=False,
                    include_root=True,
                )

                matches = config.get_all_matches(parent_element, selector_params, params.document())

                if (matches is None or len(matches) == 0) and not isinstance(config, ConstantConfig):
                    continue

                is_array = matches is not None and len(matches) > 1
                matched_nodes = parent_element if is_array else (matches or [])
                element_already_matched = not is_array

                extract_params = ExtractParams(document=params.document(),
                                               nodes=matched_nodes,
                                               url=params.url(),
                                               element_already_matched=element_already_matched)

                return config.extract(extract_params)

            else:
                # For other types of configs (non ConfigWithSelector)
                extract_params = ExtractParams(document=params.document(),
                                               nodes=parent_element,
                                               url=params.url(),
                                               element_already_matched=params.get_element_already_matched())

                val = config.extract(extract_params)
                if val is not None:
                    return val

        return None
