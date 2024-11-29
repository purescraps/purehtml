from abc import ABC
from typing import List

from purehtml.transformers.Transformer import Transformer


class NumberTransformer(Transformer, ABC):
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
        return "number"

    def transform(self, params) -> object:
        """
        Convert the value to a number if possible.
        :param params: The parameters that contain the value to be transformed.
        :return: The transformed number.
        """
        val = params.get_val()

        # If the value is a string, convert it to a number
        if isinstance(val, str):
            try:
                return int(val.replace("\"", "").strip())  # Convert string to float, remove quotes and whitespace
            except ValueError:
                print("NumberTransformer --> Not a valid number format.")
                raise ValueError("Invalid number format")  # Raising an exception instead of System.exit(-1)

        # If the value is None, return None
        if val is None:
            return None

        # If the value is not a string or valid number, throw an error
        print("NumberTransformer --> Not a valid type.")
        raise TypeError("Input is not a valid number or string representation of a number.")
