from abc import ABC
from typing import List

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class HTMLTransformer(Transformer, ABC):
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
        return "html"

    def transform(self, params: TransformParams) -> str:
        """
        Retrieve the HTML content of the given element.
        :param params: The parameters that contain the element to extract HTML content from.
        :return: The HTML content of the element.
        """
        element = params.get_element()

        # If element is found, return its HTML content; otherwise, return an empty string
        if element:
            return element.html()
        return ""
