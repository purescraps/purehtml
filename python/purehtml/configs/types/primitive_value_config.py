from typing import Any
from typing import List
from typing import Optional

from purehtml.configs.selector_match_params import GetSelectorMatchesParams
from purehtml.configs.types.config_with_selector import ConfigWithSelector
from purehtml.transformers.transform_params import TransformParams
from purehtml.transformers.transformer import Transformer


class PrimitiveValueConfig(ConfigWithSelector):
    def __init__(self, selector: Optional[str], transform: Optional[List[Transformer]] = None):
        """
        Initializes the PrimitiveValueConfig with a selector and optional transformers.
        :param selector: The CSS selector used to find the target element.
        :param transform: A list of Transformer objects (optional).
        """
        super().__init__(selector)
        self.transform = transform if transform else []

    def extract(self, params) -> Any:
        """
        Extracts a value from the parameters, applying any transformations if available.
        :param params: The ExtractParams object containing context for extraction.
        :return: The extracted and transformed value as a string.
        """
        val = None
        # Creating GetSelectorMatchesParams for selector matching
        selector_params = GetSelectorMatchesParams(
            already_matched=params.get_element_already_matched() or False,
            include_root=False,
        )

        selected_element = self.get_first_match(params.node(), selector_params, params.document())
        if selected_element:
            val = selected_element.text()

        if not self.transform:
            return val

        transform_params = TransformParams(val, selected_element, params.url())
        return self._transform_val(self.transform, transform_params, val)

    @staticmethod
    def _transform_val(transformers, transform_params, val):

        """
        Applies transformations sequentially if multiple transformers exist.
        :param transformers: A list of transformer objects.
        :param transform_params: The parameters passed to the transformers.
        :param val: The value to be transformed.
        :return: The transformed value.
        """
        if isinstance(transformers, list):
            acc = val
            for tr in transformers:
                if tr is not None:
                    acc = tr.transform(transform_params)
                    transform_params.set_val(acc)
            return acc
        elif isinstance(transformers, Transformer):
            return transformers.transform(transform_params)
        return val
