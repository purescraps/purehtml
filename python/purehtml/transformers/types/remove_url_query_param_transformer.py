from abc import ABC
from typing import List
from urllib.parse import parse_qsl
from urllib.parse import urlencode
from urllib.parse import urlsplit
from urllib.parse import urlunsplit

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class RemoveUrlQueryParamTransformer(Transformer, ABC):
    """
    removeUrlQueryParam: Remove query parameters from the url

    Usage:
    removeUrlQueryParam(): all the query parameters will be removed
    removeUrlQueryParam(foo): only the `foo` query parameter will be removed
    removeUrlQueryParam(foo, bar): query parameters `foo` and `bar` will be removed from the url
    """

    def __init__(self, args: List[str] = None):
        """
        Initialize the transformer with the query parameter keys to remove.
        :param args: Optional list of query parameter names to remove.
        """
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        """
        Set the list of query parameter names to remove.
        :param args: A list of query parameter names.
        """
        self.args = args

    def get_name(self) -> str:
        """
        Return the name of the transformer.
        :return: The name of the transformer.
        """
        return "removeUrlQueryParam"

    def transform(self, params: TransformParams) -> object:
        """
        Remove the configured query parameters (or all of them) from the URL.
        :param params: The parameters that contain the value (a URL) to be transformed.
        :return: The URL with the query parameters removed.
        """
        val = params.get_val()

        if not isinstance(val, str):
            raise TypeError(
                f"removeUrlQueryParam: expected string. Got {val!r}"
            )

        parts = urlsplit(val)

        # clear all the search params if no arguments are given
        if not self.args:
            new_query = ""
        else:
            remove_names = set(self.args)
            query_pairs = parse_qsl(parts.query, keep_blank_values=True)
            new_query = urlencode(
                [(k, v) for k, v in query_pairs if k not in remove_names]
            )

        return urlunsplit((parts.scheme, parts.netloc, parts.path, new_query, parts.fragment))
