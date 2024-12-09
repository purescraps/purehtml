import logging
from typing import Any
from typing import Dict
from typing import List
from typing import Optional
from typing import Union

import yaml

from purehtml.configs.configs import Config
from purehtml.configs.types.array_config import ArrayConfig
from purehtml.configs.types.constant_config import ConstantConfig
from purehtml.configs.types.object_config import ObjectConfig
from purehtml.configs.types.primitive_value_config import PrimitiveValueConfig
from purehtml.configs.types.union_config import UnionConfig
from purehtml.transformers.transformer_factory import TransformerFactory


class ConfigFactory:
    @staticmethod
    def from_yaml(yaml_input: Union[str, dict]) -> Config:
        """
        Parses a YAML string or dictionary and generates a Config object.
        """
        if isinstance(yaml_input, str):
            plain = yaml.safe_load(yaml_input)
            return ConfigFactory.from_dict(plain)

        elif isinstance(yaml_input, dict):
            return ConfigFactory.from_dict(yaml_input)

        else:
            logging.error(
                f"ConfigFactory.extract --> ValueError : yaml_input is not dict or str"
            )

    @staticmethod
    def from_dict(
            plain: Dict[str, Any]
    ) -> (
            ConstantConfig | ObjectConfig | ArrayConfig | UnionConfig | PrimitiveValueConfig
    ):
        """
        Generating a Config object based on the input dictionary.
        """
        constant = plain.get("constant")
        selector_orig = plain.get("selector")
        transform_orig = plain.get("transform")
        properties = plain.get("properties")
        items = plain.get("items")
        union = plain.get("union")

        selector = ConfigFactory.generate_selector(selector_orig)
        expected_type = ConfigFactory.detect_expected_type(plain)
        transformers = ConfigFactory.generate_transform(transform_orig)

        if expected_type == "constant":
            return ConstantConfig(constant, selector)

        elif expected_type == "object":

            prop_configs = (
                {
                    key: ConfigFactory.from_dict(value)
                    for key, value in properties.items()
                }
                if isinstance(properties, dict)
                else None
            )

            return ObjectConfig(selector, prop_configs)

        elif expected_type == "array":

            return ArrayConfig(
                selector, ConfigFactory.from_dict(items) if items else None, transformers
            )

        elif expected_type == "union":

            return UnionConfig([ConfigFactory.from_dict(u) for u in union])

        else:

            return PrimitiveValueConfig(selector, transformers)

    @staticmethod
    def generate_selector(selector_orig: Any) -> Optional[str]:
        """
        Generates a selector string from various input formats.
        """
        if isinstance(selector_orig, str):
            return selector_orig

        if isinstance(selector_orig, list):
            return ", ".join(map(str, selector_orig))

        if isinstance(selector_orig, dict):
            return ConfigFactory.generate_selector(selector_orig.get("selector"))

        if selector_orig is None:
            return None

        raise ValueError(f"Unexpected selector type: {type(selector_orig).__name__}")

    @staticmethod
    def generate_transform(transform_orig: Any) -> Optional[List[Any]]:
        """
        Generates a list of transformers from input data.
        """
        if transform_orig is None:
            return None

        if isinstance(transform_orig, str):
            return [TransformerFactory.create(transform_orig)]

        if isinstance(transform_orig, list):
            return [TransformerFactory.create(t) for t in transform_orig]

        raise ValueError(f"Unexpected transform type: {type(transform_orig).__name__}")

    @staticmethod
    def detect_expected_type(conf: Dict[str, Any]) -> str:
        """
        Detects the expected type of the configuration based on its keys or type field.
        """
        if "properties" in conf or conf.get("type") == "object":
            return "object"

        if "items" in conf or conf.get("type") == "array":
            return "array"

        if "union" in conf:
            return "union"

        if "constant" in conf:
            return "constant"

        return "primitive"
