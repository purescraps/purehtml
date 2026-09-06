from abc import ABC
from typing import List
from urllib.parse import urlsplit
from urllib.parse import urlunsplit

from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class RemoveLastPathSectionTransformer(Transformer, ABC):
    def __init__(self, args: List[str] = None):
        """
        Initialize the transformer with optional arguments.
        :param args: Arguments to configure the transformer (unused in this case).
        """
        super().__init__()
        self.args = args if args is not None else []

    def set_args(self, args: List[str]):
        """
        Set the list of attributes to retrieve.
        :param args: A list of attribute names.
        """
        self.args = args

    def get_name(self) -> str:
        """
        Return the name of the transformer.
        :return: The name of the transformer.
        """
        return "removeLastPathSection"

    def transform(self, params: TransformParams) -> object:
        """
        Remove the last section of the URL's path.
        :param params: The parameters that contain the value (a URL) to be transformed.
        :return: The URL with its last path section removed.
        """
        val = params.get_val()

        if val is None:
            return None

        if not isinstance(val, str):
            raise TypeError(
                f"removeLastPathSection: expects string. Got {val!r}"
            )

        parts = urlsplit(val)
        sections = parts.path.split("/")
        sections.pop()

        path = "/".join(sections)
        if path == "":
            path = "/"

        return urlunsplit((parts.scheme, parts.netloc, path, parts.query, parts.fragment))
