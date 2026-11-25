# __init__.py

from purehtml.config_factory import ConfigFactory
from purehtml.purehtml import extract
from purehtml.purehtml_validator import is_valid_config_yaml
from purehtml.backend.backend import BeautifulSoupBackend, PureHTMLDocument, PureHTMLNode

try:  # optional dependency: pip install purehtml-purescraps[selectolax]
    from purehtml.backend.selectolax_backend import SelectolaxBackend
except ImportError:  # pragma: no cover
    SelectolaxBackend = None

__all__ = [
    "BeautifulSoupBackend",
    "ConfigFactory",
    "PureHTMLDocument",
    "PureHTMLNode",
    "SelectolaxBackend",
    "extract",
    "is_valid_config_yaml",
]
