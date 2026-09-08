package com.purescraps.purehtml.transformers.types;

import java.util.List;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

/**
 * capitalize: Uppercase the first character of a string and lowercase the
 * rest, e.g. "hELLO WORLD" -> "Hello world".
 */
public class CapitalizeTransformer extends Transformer {
    private List<String> args;

    public CapitalizeTransformer(List<String> args) {
        this.args = args;
    }

    public CapitalizeTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    public String getName() {
        return "capitalize";
    }

    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (val == null) {
            return null;
        }

        if (!(val instanceof String)) {
            throw new IllegalArgumentException("capitalize: expected string. Got " + val);
        }

        String str = (String) val;
        if (str.isEmpty()) {
            return str;
        }

        String lower = str.toLowerCase();
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }
}
