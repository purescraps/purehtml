import re
from typing import List

from purehtml.transformers.transformer import Transformer
from purehtml.transformers.transformers import Transformers


class TransformerFactory:
    # Regular expression to match the transformer name
    TRANSFORMER_NAME_REGEX = re.compile(r"^([\w-]+[^(])")

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
        open_index = definition.find("(")
        if open_index == -1:
            return []

        close_index = definition.rfind(")")
        if close_index == -1 or close_index < open_index:
            return []

        return TransformerFactory._parse_arg_list(definition[open_index + 1:close_index])

    @staticmethod
    def _parse_arg_list(args_str: str) -> List[str]:
        """
        Parses a comma-separated argument list, honoring single- and
        double-quoted arguments so that delimiters, regex patterns, and
        replacement strings can contain commas, spaces, and other
        characters that would otherwise conflict with the comma separator,
        e.g. replace("\\s+", " ") or split(", "). Inside a quoted argument,
        a backslash escapes the matching quote character or another
        backslash (\\" or \\\\); any other backslash (e.g. the \\s above)
        is left untouched so regex patterns pass through unchanged. Bare
        (unquoted) arguments are trimmed of surrounding whitespace but
        otherwise taken verbatim.
        """
        args: List[str] = []
        i = 0
        n = len(args_str)

        while i < n:
            while i < n and args_str[i].isspace():
                i += 1
            if i >= n:
                break

            ch = args_str[i]
            if ch in ("\"", "'"):
                quote = ch
                i += 1
                value_chars = []
                while i < n and args_str[i] != quote:
                    if args_str[i] == "\\" and i + 1 < n and args_str[i + 1] in (quote, "\\"):
                        value_chars.append(args_str[i + 1])
                        i += 2
                    else:
                        value_chars.append(args_str[i])
                        i += 1
                i += 1  # skip closing quote
                args.append("".join(value_chars))
            else:
                start = i
                while i < n and args_str[i] != ",":
                    i += 1
                args.append(args_str[start:i].strip())

            while i < n and args_str[i].isspace():
                i += 1
            if i < n and args_str[i] == ",":
                i += 1

        return args
