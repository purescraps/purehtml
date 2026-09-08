from abc import ABC
from typing import List

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class BooleanTransformer(Transformer, ABC):
    """
    boolean: Explicitly cast any value to a boolean using truthy semantics.

    Unlike `exists` (which reports whether an element/attribute is
    present), `boolean` casts the value itself: None, "", 0, False, and
    empty lists/dicts are false; everything else is true.
    """

    def __init__(self, args: List[str] = None):
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        self.args = args

    def get_name(self) -> str:
        return "boolean"

    def transform(self, params: TransformParams) -> bool:
        return bool(params.get_val())
