from abc import ABC
from typing import List

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class SplitTransformer(Transformer, ABC):
    """
    split: Split a string into a list

    Usage:
    split(): splits on runs of whitespace, like Python's str.split()
    split(delimiter): splits on the literal `delimiter` string
    """

    def __init__(self, args: List[str] = None):
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        self.args = args

    def get_name(self) -> str:
        return "split"

    def transform(self, params: TransformParams):
        val = params.get_val()

        if val is None:
            return None

        if not isinstance(val, str):
            raise TypeError(f"split: expected string. Got {val!r}")

        if not self.args:
            return val.split()

        return val.split(self.args[0])
