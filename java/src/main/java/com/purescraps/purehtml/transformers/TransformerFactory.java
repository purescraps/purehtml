package com.purescraps.purehtml.transformers;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TransformerFactory {

    private static final Pattern TRANSFORMER_NAME_REGEX = Pattern.compile("^([\\w-]+[^(])");
    private static final Pattern TRANSFORMER_ARGUMENT_PARENTHESIS_REGEX = Pattern
            .compile("\\((([\\w-]+\\s*,?\\s*)*)\\)");
    private static final Pattern TRANSFORMER_ARGUMENT_NAME_REGEX = Pattern.compile("[\\w-]+");

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
        List<String> args = new ArrayList<>();
        Matcher paranthesisMatcher = TRANSFORMER_ARGUMENT_PARENTHESIS_REGEX.matcher(def);
        if (paranthesisMatcher.find()) {

            Matcher argumentMatcher = TRANSFORMER_ARGUMENT_NAME_REGEX.matcher(paranthesisMatcher.group(0));
            while (argumentMatcher.find()) {
                args.add(argumentMatcher.group(0));
            }
        }
        return args;
    }
}
