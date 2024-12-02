import yaml
from bs4 import BeautifulSoup

from purehtml.Validator import Validator
from purehtml.configs.ExtractParamsBuilder import ExtractParamsBuilder


class PureHTML:

    @staticmethod
    def extract(config, html, plain):
        """
        This method is for the already created Map (dict) from YAML data.
        """
        document = BeautifulSoup(html, 'html.parser')
        selector = plain.get("selector")
        elements = None
        if selector:
            elements = document.select(selector)

        extract_params = ExtractParamsBuilder() \
            .set_document(document) \
            .set_node(elements) \
            .set_url(html) \
            .set_element_already_matched(False) \
            .set_element(None) \
            .build()

        return config.extract(extract_params)

    @staticmethod
    def extract_from_yaml(config, html, yaml_string):
        """
        This method is for extracting using the YAML string.
        """
        # Validate YAML (we assume a validate function exists)
        Validator.validate(yaml_string)

        document = BeautifulSoup(html, 'html.parser')
        plain = yaml.safe_load(yaml_string)
        selector = plain.get("selector")
        elements = None
        if selector:
            elements = document.select(selector)

        extract_params = ExtractParamsBuilder() \
            .set_document(document) \
            .set_node(elements) \
            .set_url(html) \
            .set_element_already_matched(False) \
            .set_element(None) \
            .build()

        return config.extract(extract_params)