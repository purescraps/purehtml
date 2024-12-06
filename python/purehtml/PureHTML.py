import re
from typing import Any, List

import yaml
from bs4 import BeautifulSoup

from purehtml.backend.backend import PureHTMLInitializer
from purehtml.configs.ExtractParams import ExtractParams
from purehtml.PureHTMLValidator import is_valid_config_yaml


def extract_urls(html):
    """
    This method extracts urls from html string, used for urlQueryParams transform.
    """
    soup = BeautifulSoup(html, "html.parser")
    links = [tag["href"] for tag in soup.find_all("a", href=True)]

    if links:
        return links

    # Fallback to regex for malformed HTML
    cleaned_string = re.sub(r"<[^>]*>", "", html)
    return re.findall(r"https?://\S+", cleaned_string)


def extract_from_dict(config, html, plain):
    """
    This method is for the already created Map (dict) from YAML data. Used for tests.
    """
    selector = plain.get("selector")

    matched = False
    doc = PureHTMLInitializer().load(html)

    if selector:
        soup_nodes = doc.select(selector)
        if len(soup_nodes) > 0:
            matched = True

    else:
        soup_nodes = []

    urls = extract_urls(html)
    url = html
    if isinstance(urls, List):
        if len(urls) > 0:
            url = urls[0]

    extract_params = ExtractParams(
        document=doc, nodes=soup_nodes, url=url, element_already_matched=matched
    )

    return config.extract(extract_params)


def extract(config, html) -> Any:
    # Initialize the backend and load the HTML
    doc = PureHTMLInitializer().load(html)

    urls = extract_urls(html)

    url = html
    if isinstance(urls, List):
        if len(urls) > 0:
            url = urls[0]

    extract_params = ExtractParams(
        document=doc, nodes=[], url=url, element_already_matched=False
    )

    return config.extract(extract_params)
