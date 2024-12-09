from typing import Any
from typing import Union

from bs4 import BeautifulSoup

from purehtml.backend.backend import BeautifulSoupBackend
from purehtml.configs.extract_params import ExtractParams


def extract(config, html: Union[str, BeautifulSoup], url: str) -> Any:
    """
    Initialize the backend and load the HTML
    """

    # Checking the input
    doc = html
    if isinstance(html, str):
        doc = BeautifulSoupBackend().load(html)

    extract_params = ExtractParams(
        document=doc, nodes=[], url=url, element_already_matched=False
    )

    return config.extract(extract_params)
