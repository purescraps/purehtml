from abc import ABC
from abc import abstractmethod
from typing import List


class Transformer(ABC):

    def __init__(self):
        self.args = []  # Default argument list

    @abstractmethod
    def set_args(self, args: List[str]):
        """
        Set the arguments for the transformer.
        :param args: A list of arguments to configure the transformer. Not used by all the transformers.
        """
        pass

    def get_name(self) -> str:
        """
        Get the name of the transformer. Must be implemented by subclasses.
        :raises NotImplementedError: If not implemented by the subclass.
        """
        raise NotImplementedError("get_name() must be implemented by subclass.")

    @abstractmethod
    def transform(self, params) -> object:
        """
        Transform the input based on the given parameters.
        :param params: The parameters to apply the transformation.
        :return: The transformed value.
        """
        pass
