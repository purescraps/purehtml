from abc import ABC
from typing import List, Union

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class _KeySegment:
    __slots__ = ("key",)

    def __init__(self, key: str):
        self.key = key


class _IndexSegment:
    __slots__ = ("index",)

    def __init__(self, index: int):
        self.index = index


_Segment = Union[_KeySegment, _IndexSegment]


def _is_ident_char(ch: str) -> bool:
    return ch.isalnum() or ch == "_"


def _parse_json_path(path: str) -> List[_Segment]:
    """
    Parses a minimal jsonpath subset: dot notation for object keys
    (`$.a.b`), bracket notation with a quoted key for keys with special
    characters (`$["a-b"]`), and bracket notation with an integer for array
    indices, including negative indices counted from the end (`$.a[-1]`).
    """
    if not path or path[0] != "$":
        raise ValueError(f'jsonpath: invalid path {path!r}: must start with "$"')

    segments: List[_Segment] = []
    i = 1
    n = len(path)

    while i < n:
        ch = path[i]
        if ch == ".":
            i += 1
            start = i
            while i < n and _is_ident_char(path[i]):
                i += 1
            if i == start:
                raise ValueError(f'jsonpath: invalid path {path!r}: expected a name after "."')
            segments.append(_KeySegment(path[start:i]))
        elif ch == "[":
            i += 1
            if i >= n:
                raise ValueError(f'jsonpath: invalid path {path!r}: unterminated "["')
            if path[i] in ("\"", "'"):
                quote = path[i]
                i += 1
                chars = []
                while i < n and path[i] != quote:
                    if path[i] == "\\" and i + 1 < n and path[i + 1] in (quote, "\\"):
                        chars.append(path[i + 1])
                        i += 2
                    else:
                        chars.append(path[i])
                        i += 1
                if i >= n:
                    raise ValueError(f"jsonpath: invalid path {path!r}: unterminated quoted key")
                i += 1  # skip closing quote
                segments.append(_KeySegment("".join(chars)))
            elif path[i] == "-" or path[i].isdigit():
                start = i
                if path[i] == "-":
                    i += 1
                digits_start = i
                while i < n and path[i].isdigit():
                    i += 1
                if i == digits_start:
                    raise ValueError(f'jsonpath: invalid path {path!r}: expected an index inside "[]"')
                segments.append(_IndexSegment(int(path[start:i])))
            else:
                raise ValueError(f'jsonpath: invalid path {path!r}: expected an index or quoted key inside "[]"')
            if i >= n or path[i] != "]":
                raise ValueError(f'jsonpath: invalid path {path!r}: expected "]"')
            i += 1
        else:
            raise ValueError(f'jsonpath: invalid path {path!r}: unexpected character {ch!r} at position {i}')

    return segments


def _evaluate_json_path(root, segments: List[_Segment]):
    current = root

    for segment in segments:
        if current is None:
            return None

        if isinstance(segment, _IndexSegment):
            if not isinstance(current, list):
                return None
            index = segment.index
            if index < 0:
                index += len(current)
            if index < 0 or index >= len(current):
                return None
            current = current[index]
        else:
            if not isinstance(current, dict):
                return None
            if segment.key not in current:
                return None
            current = current[segment.key]

    return current


class JSONPathTransformer(Transformer, ABC):
    """
    jsonpath: Extract a value from a parsed JSON value by path

    Usage:
    jsonpath(path): navigates a JSON value (typically the output of `json`)
    using dot notation for object keys (`$.a.b`) and bracket notation for
    array indices or keys with special characters (`$.a[0]`, `$["a-b"]`).
    Negative indices count from the end of the array. Returns None when the
    path does not resolve to a value.
    """

    def __init__(self, args: List[str] = None):
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        self.args = args

    def get_name(self) -> str:
        return "jsonpath"

    def transform(self, params: TransformParams):
        val = params.get_val()

        if val is None:
            return None

        if len(self.args) < 1:
            raise ValueError('jsonpath: requires a path, e.g. jsonpath("$.a.b")')

        segments = _parse_json_path(self.args[0])
        return _evaluate_json_path(val, segments)
