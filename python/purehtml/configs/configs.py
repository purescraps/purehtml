from abc import ABC
from abc import abstractmethod

from purehtml.configs.extract_params import ExtractParams


class Config(ABC):
    @abstractmethod
    def extract(self, params: ExtractParams) -> str:
        """
        Abstract method to be implemented by subclasses.
        :param params: ExtractParams object
        :return:  result
        """
        pass
