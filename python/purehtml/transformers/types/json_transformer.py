import json
from abc import ABC
from typing import List

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class JSONTransformer(Transformer, ABC):
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
        return "json"

    def transform(self, params: TransformParams) -> object:
        """
        Parse the text content of the element as JSON.
        :param params: The parameters that contain the element to extract the JSON from.
        :return: The parsed JSON value, or None if the element does not exist.
        """
        element = params.get_element()

        if element is None:
            return None

        return json.loads(element.text())
