package com.purescraps.purehtml.transformers.types;

import java.util.List;
import java.util.stream.Collectors;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

/**
 * join: Join a list of values into a string
 *
 * Usage:
 * join(): joins with an empty string
 * join(delimiter): joins elements using `delimiter`
 */
public class JoinTransformer extends Transformer {
    private List<String> args;

    public JoinTransformer(List<String> args) {
        this.args = args;
    }

    public JoinTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    public String getName() {
        return "join";
    }

    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (val == null) {
            return null;
        }

        if (!(val instanceof List)) {
            throw new IllegalArgumentException("join: expected array. Got " + val);
        }

        String delimiter = (args != null && !args.isEmpty()) ? args.get(0) : "";

        return ((List<?>) val).stream()
                .map(String::valueOf)
                .collect(Collectors.joining(delimiter));
    }
}
