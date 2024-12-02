from purehtml.transformers.types.NumberTransformer import NumberTransformer
from purehtml.transformers.types.AttributeTransformer import AttributeTransformer
from purehtml.transformers.types.ExistsTransformer import ExistsTransformer
from purehtml.transformers.types.HTMLTransformer import HTMLTransformer
from purehtml.transformers.types.LengthTransformer import LengthTransformer
from purehtml.transformers.types.ResolveTransformer import ResolveTransformer
from purehtml.transformers.types.TrimTransformer import TrimTransformer
from purehtml.transformers.types.UrlQueryParamsTransformer import UrlQueryParamTransformer


class Transformers:
    # List of transformer classes
    transformers = [
        AttributeTransformer,
        ExistsTransformer,
        HTMLTransformer,
        LengthTransformer,
        NumberTransformer,
        ResolveTransformer,
        UrlQueryParamTransformer,
        TrimTransformer,
    ]

    _transformer_lookup = {
        transformer_class().get_name(): transformer_class
        for transformer_class in transformers
    }

    @staticmethod
    def get_by_name(name: str):
        """
        Get a transformer instance by its name.
        :param name: The name of the transformer to find.
        :return: The transformer instance if found, or None if not.
        """
        transformer_class = Transformers._transformer_lookup.get(name)
        if transformer_class:
            try:
                return transformer_class()
            except Exception as e:
                print(f"Error instantiating transformer {transformer_class}: {e}")
        return None  # Return None if no matching transformer is found
