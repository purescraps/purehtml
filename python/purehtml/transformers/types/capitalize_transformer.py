from abc import ABC
from typing import List

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class CapitalizeTransformer(Transformer, ABC):
    """
    capitalize: Uppercase the first character of a string and lowercase the
    rest, e.g. "hELLO WORLD" -> "Hello world".
    """

    def __init__(self, args: List[str] = None):
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        self.args = args

    def get_name(self) -> str:
        return "capitalize"

    def transform(self, params: TransformParams):
        val = params.get_val()

        if val is None:
            return None

        if not isinstance(val, str):
            raise TypeError(f"capitalize: expected string. Got {val!r}")

        return val.capitalize()
