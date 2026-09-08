from abc import ABC
from typing import List

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class JoinTransformer(Transformer, ABC):
    """
    join: Join a list of values into a string

    Usage:
    join(): joins with an empty string
    join(delimiter): joins elements using `delimiter`
    """

    def __init__(self, args: List[str] = None):
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        self.args = args

    def get_name(self) -> str:
        return "join"

    def transform(self, params: TransformParams):
        val = params.get_val()

        if val is None:
            return None

        if not isinstance(val, (list, tuple)):
            raise TypeError(f"join: expected array. Got {val!r}")

        delimiter = self.args[0] if self.args else ""

        return delimiter.join(str(item) for item in val)
