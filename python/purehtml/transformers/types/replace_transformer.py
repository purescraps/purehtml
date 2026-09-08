import re
from abc import ABC
from typing import List

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class ReplaceTransformer(Transformer, ABC):
    """
    replace: Replace regex/string matches in a string

    Usage:
    replace(pattern, replacement): replaces every match of `pattern` (a
    regular expression) with `replacement`. `replacement` may reference
    capture groups using \\1, \\2, etc.
    """

    def __init__(self, args: List[str] = None):
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        self.args = args

    def get_name(self) -> str:
        return "replace"

    def transform(self, params: TransformParams):
        val = params.get_val()

        if val is None:
            return None

        if not isinstance(val, str):
            raise TypeError(f"replace: expected string. Got {val!r}")

        if len(self.args) < 2:
            raise ValueError(
                "replace: requires a pattern and a replacement, e.g. replace(\\s+, ' ')"
            )

        pattern, replacement = self.args[0], self.args[1]

        try:
            return re.sub(pattern, replacement, val)
        except re.error as e:
            raise ValueError(f"replace: invalid pattern: {pattern!r}") from e
