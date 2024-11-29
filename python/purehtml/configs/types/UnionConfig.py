from typing import List

from purehtml.configs.ExtractParams import ExtractParams
from purehtml.configs.ExtractParamsBuilder import ExtractParamsBuilder
from purehtml.configs.GetSelectorMatchesParams import GetSelectorMatchesParams
from purehtml.configs.Configs import Config
from purehtml.configs.types.ConfigWithSelector import ConfigWithSelector


class UnionConfig(Config):
    def __init__(self, configs: List[Config]):
        """
        Initializes the UnionConfig with a list of Config objects.
        :param configs: List of Config objects.
        """
        super().__init__()
        self.configs = configs

    def extract(self, params: ExtractParams) -> str:
        """
        Extracts values from the list of configs based on provided parameters.
        :param params: The ExtractParams object containing context for extraction.
        :return: A string representation of the extracted values.
        """
        parent_element = params.node()  # This is the equivalent of elements in Java
        #result = []
        result: List[str] = []  # Empty list of strings
        config_index = 0

        for config in self.configs:
            if isinstance(config, ConfigWithSelector):
                # Creating an instance of GetSelectorMatchesParams
                selector_params = GetSelectorMatchesParams(
                    already_matched=False,
                    include_root=True,
                    doc=params.document()
                )

                element = None
                # Get the matching elements
                elements = config.get_first(parent_element, selector_params)
                if not elements:
                    continue
                #below is for last config if it is constant. it will return null otherwise.
                if elements is None:
                    if config_index != len(self.configs) - 1:
                        config_index += 1
                        continue
                else:

                    element = elements if elements else None
                    #element_index += 1

                # Build ExtractParams for this element
                extract_params = ExtractParamsBuilder() \
                    .set_document(params.document()) \
                    .set_node(params.node()) \
                    .set_url(params.url()) \
                    .set_element_already_matched(True) \
                    .set_element(element) \
                    .build()

                # Extract and append the result
                result.append(config.extract(extract_params))
            else:
                # For other types of configs (non ConfigWithSelector)
                extract_params = ExtractParamsBuilder() \
                    .set_document(params.document()) \
                    .set_node(params.node()) \
                    .set_url(params.url()) \
                    .set_element_already_matched(params.get_element_already_matched()) \
                    .set_element(params.element()) \
                    .build()

                result.append(config.extract(extract_params))

        if len(result) == 1:
            return str(result[0])
        else:
            return str(result)
        #return ", ".join(map(str, result))
