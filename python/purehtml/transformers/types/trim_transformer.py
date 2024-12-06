from abc import ABC
from typing import List
from typing import Optional

from purehtml.transformers.transformer import Transformer


class TrimTransformer(Transformer, ABC):
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
        return "trim"

    def transform(self, params) -> Optional[str]:
        """
        Trim the input string value by removing leading and trailing whitespace.
        :param params: The parameters that contain the value to be transformed.
        :return: The transformed string with whitespace trimmed.
        """
        val = params.get_val()

        # If the value is None, return None
        if val is None:
            return None

        # If the value is a string, trim it
        if isinstance(val, str):
            return val.strip()  # Trim leading and trailing whitespace

        # If the value is not a string, throw an error
        raise TypeError("Trim: invalid value type: {type(val).__name__}")
