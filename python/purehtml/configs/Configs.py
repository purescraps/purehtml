from abc import ABC, abstractmethod

from purehtml.configs.ExtractParams import ExtractParams


class Config(ABC):
    @abstractmethod
    def extract(self, params: ExtractParams) -> str:
        """
        Abstract method to be implemented by subclasses.
        :param params: ExtractParams object
        :return:  result
        """
        pass