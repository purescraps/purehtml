from typing import Any

from purehtml.configs.configs import Config
from purehtml.configs.extract_params import ExtractParams


class DefaultValueConfig(Config):
    """
    Wraps another config and substitutes a fallback value whenever the wrapped
    config's extraction result is `None` (a non-matching selector, an empty
    union, etc.). This is what powers the per-field `default: <value>` config
    option, and applies uniformly regardless of the wrapped config's type.
    """

    def __init__(self, inner: Config, default_value: Any):
        """
        Initialize DefaultValueConfig with an inner config and a fallback value.
        :param inner: The wrapped Config object whose result may be replaced.
        :param default_value: The value to return when the inner result is None.
        """
        super().__init__()
        self.inner = inner
        self.default_value = default_value

    def extract(self, params: ExtractParams) -> Any:
        """
        Extracts the value from the inner config, falling back to the configured
        default value only when that result is None.
        :param params: The ExtractParams object containing context for extraction.
        :return: The inner config's result, or the default value if it was None.
        """
        val = self.inner.extract(params)

        return self.default_value if val is None else val
