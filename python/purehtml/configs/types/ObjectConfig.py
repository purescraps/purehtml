from typing import Dict

from purehtml.configs.ExtractParams import ExtractParams
from purehtml.configs.ExtractParamsBuilder import ExtractParamsBuilder
from purehtml.configs.Configs import Config
from purehtml.configs.types.ConfigWithSelector import ConfigWithSelector


class ObjectConfig(ConfigWithSelector):
    """
    Concrete class representing an object configuration with selector and properties.
    """
    def __init__(self, selector: str, properties: Dict[str, Config]):
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

    def extract(self, params: ExtractParams) -> str:
        """
        Extract values for each property based on the provided parameters.
        :param params: The ExtractParams object containing context for extraction.
        :return: A dictionary of extracted property values.
        """
        props = self.properties
        result = {}

        for key, config in props.items():
            extract_params = (
                ExtractParamsBuilder()
                .set_document(params.document())
                .set_node(params.node())
                .set_url(params.url())
                .set_element_already_matched(params.get_element_already_matched())
                .set_element(params.element())
                .build()
            )
            result[str(key)] = config.extract(extract_params)

        return str(result)
        #cleaned_dict = clean_dict_values(result)
        # Convert the cleaned dictionary to JSON
        #json_data = json.dumps(cleaned_dict)
        #return json_data


def clean_dict_values(d):
    cleaned_dict = {}
    for key, value in d.items():
        if isinstance(value, str):
            # Remove leading/trailing double quotes and unescape inner quotes
            cleaned_dict[key] = value.strip('"').replace('\\"', '"')
        else:
            cleaned_dict[key] = value  # Keep non-string values as is
    return cleaned_dict