
from typing import List, Optional

from bs4 import Tag

from purehtml.configs.GetSelectorMatchesParams import GetSelectorMatchesParams
from purehtml.configs.types.ConfigWithSelector import ConfigWithSelector
from purehtml.transformers.TransformParams import TransformParams
from purehtml.transformers.Transformer import Transformer


class PrimitiveValueConfig(ConfigWithSelector):
    def __init__(self, selector: str, transform: Optional[List[Transformer]] = None):
        """
        Initializes the PrimitiveValueConfig with a selector and optional transformers.
        :param selector: The CSS selector used to find the target element.
        :param transform: A list of Transformer objects (optional).
        """
        super().__init__(selector)
        self.transform = transform if transform else []

    def extract(self, params) -> str:
        """
        Extracts a value from the parameters, applying any transformations if available.
        :param params: The ExtractParams object containing context for extraction.
        :return: The extracted and transformed value as a string.
        """
        val = None
        node = None

        # Creating GetSelectorMatchesParams for selector matching
        selector_params = GetSelectorMatchesParams(
            already_matched=params.get_element_already_matched(),
            include_root=False,
            doc=params.document()
        )

        if params.element():
            # If element is provided, extract its text
            val = params.element().text
            if not self.transform:
                return str(val)  # Return the value directly if no transformations
            transform_params = TransformParams(val, params.element(), params.url())
            return self._transform_val(self.transform, transform_params, val)

        # If no element is provided, use the selector to find the first match
        elements = self.get_first(params.node(), selector_params)

        if isinstance(elements, Tag):  # If the element is found
            val = elements.text
            node = elements

        if not self.transform:
            return str(val)
            #return str(val)  # Return the value directly if no transformations

        # Apply transformations
        transform_params = TransformParams(val, node, params.url())
        return self._transform_val(self.transform, transform_params, val)

    def _transform_val(self, transformers, transform_params, val):
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
