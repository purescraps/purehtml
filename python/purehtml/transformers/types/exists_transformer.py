from abc import ABC
from typing import List

from purehtml.transformers.transformer import Transformer


class ExistsTransformer(Transformer, ABC):
    def __init__(self, args: List[str] = None):
        """
        Initialize the transformer with optional arguments.
        :param args: A list of arguments for the transformer (not used in this transformer).
        """
        super().__init__()
        self.args = args  # Store the arguments (though unused in this transformer)

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
        return "exists"

    def transform(self, params) -> bool:
        """
        Check if the element exists (i.e., if it's not None).
        :param params: The parameters that contain the element to check.
        :return: True if the element exists (is non-null), False otherwise.
        """
        element = params.get_element()

        # Return True if the element is non-null, False otherwise
        return element is not None
