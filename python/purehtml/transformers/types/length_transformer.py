from abc import ABC
from typing import Any
from typing import List

from purehtml.transformers.transformer import Transformer


class LengthTransformer(Transformer, ABC):
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
        return "length"

    def transform(self, params) -> Any:
        """
        Returns the length of the given value if it's a string or array.
        :param params: The parameters that contain the value to calculate length from.
        :return: The length of the string or array, or raises an exception for invalid types.
        """
        val = params.get_val()

        # If the value is None, return None
        if val is None:
            return None

        # If the value is a string, return its length
        if isinstance(val, str):
            return len(val)

        # If the value is a list (array), return its length
        elif isinstance(val, (list, tuple)):
            return len(val)

        # If the value is neither a string nor a list/tuple, throw an error
        raise ValueError(f"LengthTransformer --> Invalid value type: {type(val)}")
