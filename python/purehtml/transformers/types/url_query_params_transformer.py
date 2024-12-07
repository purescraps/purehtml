from abc import ABC
from typing import List
from typing import Optional
from urllib.parse import parse_qs
from urllib.parse import urlparse

from purehtml.transformers.transformer import Transformer


def parse(url: str) -> dict:
    """
    Parse the query string of the given URL and return the parameters as a dictionary.
    :param url: The URL string.
    :return: Dictionary with query parameter keys and values.
    """
    query = urlparse(url).query
    params = parse_qs(query)

    # Convert list values to single values (assuming they only have one value)
    return {key: values[0] for key, values in params.items()}


class UrlQueryParamTransformer(Transformer, ABC):
    def __init__(self, args: Optional[List[str]] = None):
        """
        Initialize the transformer with the query parameter keys.
        :param args: Optional list of argument names (query parameter keys) to fetch.
        """
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        """
        Set the list of attributes to retrieve.
        :param args: A list of attribute names.
        """
        self.args = args

    def get_name(self) -> str:
        """
        Return the name of the transformer.
        :return: The name of the transformer.
        """
        return "urlQueryParam"

    def transform(self, params) -> dict:
        """
        Extract query parameters from the URL and return them based on arguments.
        :param params: The parameters that contain the URL and the element.
        :return: A dictionary of query parameters or a specific value if arguments are provided.
        """
        element = params.get_element()  # Assuming `params` has `get_element()`
        url = params.get_url()  # Base URL from params

        query_params = parse(url)
        json_object = {}

        if len(self.args) == 1:

            key = self.args[0]
            if key in query_params:
                return query_params[key]

            return element.get(key, None)  # Assuming `element.get()` for attributes (adjust if needed)

        elif len(self.args) == 0:

            return query_params  # Return all query parameters

        else:
            for arg in self.args:

                if arg in query_params:
                    json_object[arg] = query_params[arg]

            return json_object
