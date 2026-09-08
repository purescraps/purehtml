package com.purescraps.purehtml.transformers.types;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

/**
 * split: Split a string into a list
 *
 * Usage:
 * split(): splits on runs of whitespace, like Python's str.split()
 * split(delimiter): splits on the literal `delimiter` string
 */
public class SplitTransformer extends Transformer {
    private List<String> args;

    public SplitTransformer(List<String> args) {
        this.args = args;
    }

    public SplitTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    public String getName() {
        return "split";
    }

    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (val == null) {
            return null;
        }

        if (!(val instanceof String)) {
            throw new IllegalArgumentException("split: expected string. Got " + val);
        }

        String str = (String) val;

        if (args == null || args.isEmpty()) {
            String trimmed = str.trim();
            if (trimmed.isEmpty()) {
                return new ArrayList<String>();
            }
            return new ArrayList<>(Arrays.asList(trimmed.split("\\s+")));
        }

        // -1 limit keeps trailing empty strings, matching JS/Python literal split semantics
        return new ArrayList<>(Arrays.asList(str.split(Pattern.quote(args.get(0)), -1)));
    }
}
