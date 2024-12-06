from typing import Any

from purehtml.backend.backend import PureHTMLInitializer
from purehtml.configs.ExtractParams import ExtractParams


def extract(config, html, url) -> Any:
    # Initialize the backend and load the HTML
    doc = PureHTMLInitializer().load(html)

    extract_params = ExtractParams(
        document=doc, nodes=[], url=url, element_already_matched=False
    )

    return config.extract(extract_params)
