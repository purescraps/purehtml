from abc import ABC
from typing import List

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class LowerTransformer(Transformer, ABC):
    def __init__(self, args: List[str] = None):
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        self.args = args

    def get_name(self) -> str:
        return "lower"

    def transform(self, params: TransformParams):
        val = params.get_val()

        if val is None:
            return None

        if isinstance(val, str):
            return val.lower()

        raise TypeError(f"lower: expected string. Got {val!r}")
