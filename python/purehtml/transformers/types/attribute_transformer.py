from abc import ABC
from typing import List
from typing import Union

from purehtml.transformers.transformer import Transformer


class AttributeTransformer(Transformer, ABC):
    def __init__(self, args: List[str] = None):
        """
        Initialize the transformer with optional arguments.
        :param args: A list of attribute names to retrieve (can be empty for all attributes).
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
        return "attr"

    def transform(self, params) -> Union[dict, str]:
        """
        Retrieve the attributes of the HTML element.
        :param params: The parameters that contain the element to extract attributes from.
        :return: A dictionary of attributes.
        """

        element = params.get_element()
        attributes = {}

        if len(self.args) == 1:
            # If only one argument is provided, return the value of that attribute
            attribute_name = self.args[0].replace("(", "").replace(")", "")

            return element.attr(attribute_name)

        elif not self.args:

            return element.attr()

        else:
            # If multiple arguments are provided, return the specified attributes
            for arg in self.args:
                attributes[arg] = element.get(arg)

        return attributes
