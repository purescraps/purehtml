package com.purescraps.purehtml.transformers;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TransformerFactory {

    private static final Pattern TRANSFORMER_NAME_REGEX = Pattern.compile("^([\\w-]+[^(])");

    public static Transformer create(String transform) {

        String transformerName = extractTransformerName(transform);
        List<String> args = extractTransformerArgs(transform);

        Transformer transformerImpl = Transformers.getByName(transformerName);
        if (transformerImpl == null) {
            throw new IllegalArgumentException("Transformer with name \"" + transformerName + "\" not found.");
        }
        transformerImpl.setArgs(args);
        return transformerImpl;

    }

    private static String extractTransformerName(String def) {
        Matcher matcher = TRANSFORMER_NAME_REGEX.matcher(def);
        if (!matcher.find()) {
            throw new IllegalArgumentException("Invalid transformer name: " + def);
        }
        return matcher.group(0);
    }

    private static List<String> extractTransformerArgs(String def) {
        int openIndex = def.indexOf('(');
        if (openIndex == -1) {
            return new ArrayList<>();
        }

        int closeIndex = def.lastIndexOf(')');
        if (closeIndex == -1 || closeIndex < openIndex) {
            return new ArrayList<>();
        }

        return parseArgList(def.substring(openIndex + 1, closeIndex));
    }

    /**
     * Parses a comma-separated argument list, honoring single- and
     * double-quoted arguments so that delimiters, regex patterns, and
     * replacement strings can contain commas, spaces, and other characters
     * that would otherwise conflict with the comma separator, e.g.
     * replace("\s+", " ") or split(", "). Inside a quoted argument, a
     * backslash escapes the matching quote character or another backslash
     * (\" or \\); any other backslash (e.g. the \s above) is left untouched
     * so regex patterns pass through unchanged. Bare (unquoted) arguments
     * are trimmed of surrounding whitespace but otherwise taken verbatim.
     */
    private static List<String> parseArgList(String argsStr) {
        List<String> args = new ArrayList<>();
        int i = 0;
        int n = argsStr.length();

        while (i < n) {
            while (i < n && Character.isWhitespace(argsStr.charAt(i))) {
                i++;
            }
            if (i >= n) {
                break;
            }

            char ch = argsStr.charAt(i);
            if (ch == '"' || ch == '\'') {
                char quote = ch;
                i++;
                StringBuilder value = new StringBuilder();
                while (i < n && argsStr.charAt(i) != quote) {
                    char c = argsStr.charAt(i);
                    char next = (i + 1 < n) ? argsStr.charAt(i + 1) : '\0';
                    if (c == '\\' && i + 1 < n && (next == quote || next == '\\')) {
                        value.append(next);
                        i += 2;
                    } else {
                        value.append(c);
                        i++;
                    }
                }
                i++; // skip closing quote
                args.add(value.toString());
            } else {
                int start = i;
                while (i < n && argsStr.charAt(i) != ',') {
                    i++;
                }
                args.add(argsStr.substring(start, i).trim());
            }

            while (i < n && Character.isWhitespace(argsStr.charAt(i))) {
                i++;
            }
            if (i < n && argsStr.charAt(i) == ',') {
                i++;
            }
        }

        return args;
    }
}
