from purehtml.transformers.types.attribute_transformer import AttributeTransformer
from purehtml.transformers.types.exists_transformer import ExistsTransformer
from purehtml.transformers.types.html_transformer import HTMLTransformer
from purehtml.transformers.types.length_transformer import LengthTransformer
from purehtml.transformers.types.number_transformer import NumberTransformer
from purehtml.transformers.types.resolve_transformer import ResolveTransformer
from purehtml.transformers.types.trim_transformer import TrimTransformer
from purehtml.transformers.types.url_query_params_transformer import UrlQueryParamTransformer


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
