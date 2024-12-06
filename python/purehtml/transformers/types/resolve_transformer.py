from abc import ABC
from typing import List
from urllib.parse import urljoin

from purehtml.transformers.transformer import Transformer


class ResolveTransformer(Transformer, ABC):
    def __init__(self, args: List[str] = None):
        """
        Initialize the transformer with optional arguments.
        :param args: Arguments to configure the transformer (unused in this case).
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
        return "resolve"

    def transform(self, params) -> str:
        """
        Resolves a relative URL based on a base URL.
        :param params: The parameters that contain the value (relative URL) and the base URL.
        :return: The resolved absolute URL.
        """
        val = params.get_val()  # Get the relative URL value from the params
        base_url = params.get_url()  # Get the base URL from the params

        if val is not None:
            try:
                # Resolve the relative URL to an absolute URL using urljoin
                resolved_url = urljoin(base_url, val)
                return resolved_url

            except Exception as e:
                print(f"Error resolving URL: {e}")
                raise

        raise ValueError(f"ResolveTransformer: Invalid value type: {type(val)}")
