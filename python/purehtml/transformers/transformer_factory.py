import re
from typing import List

from purehtml.transformers.transformer import Transformer
from purehtml.transformers.transformers import Transformers


class TransformerFactory:
    # Regular expressions to match transformer name and arguments
    TRANSFORMER_NAME_REGEX = re.compile(r"^([\w-]+[^(])")
    TRANSFORMER_ARGUMENT_PARENTHESIS_REGEX = re.compile(r"\((([\w-]+\s*,?\s*)*)\)")
    TRANSFORMER_ARGUMENT_NAME_REGEX = re.compile(r"[\w-]+")

    @staticmethod
    def create(transform: str) -> 'Transformer':
        # Extract the transformer name and arguments
        transformer_name = TransformerFactory.extract_transformer_name(transform)
        args = TransformerFactory.extract_transformer_args(transform)

        # Get the transformer instance by name
        transformer_impl = Transformers.get_by_name(transformer_name)

        if transformer_impl is None:
            raise ValueError(f"Transformer with name \"{transformer_name}\" not found.")

        # Set arguments for the transformer
        transformer_impl.set_args(args)
        return transformer_impl

    @staticmethod
    def extract_transformer_name(definition: str) -> str:
        """
        Extracts the transformer name from the definition string.
        :param definition: The full transformer definition (name + arguments).
        :return: The transformer name as a string.
        """

        matcher = TransformerFactory.TRANSFORMER_NAME_REGEX.match(definition)
        if not matcher:
            raise ValueError(f"Invalid transformer name: {definition}")
        return matcher.group(0)

    @staticmethod
    def extract_transformer_args(definition: str) -> List[str]:
        """
        Extracts the transformer arguments from the definition string.
        :param definition: The full transformer definition (name + arguments).
        :return: A list of arguments (strings).
        """
        args = []
        parenthesis_matcher = TransformerFactory.TRANSFORMER_ARGUMENT_PARENTHESIS_REGEX.search(definition)

        if parenthesis_matcher:
            # Extract the arguments part from parentheses

            arguments_str = parenthesis_matcher.group(1)

            if arguments_str:
                # Match individual arguments
                argument_matcher = TransformerFactory.TRANSFORMER_ARGUMENT_NAME_REGEX.findall(arguments_str)
                args.extend(argument_matcher)
        return args
