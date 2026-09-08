package com.purescraps.purehtml.transformers.types;

import java.util.List;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class UpperTransformer extends Transformer {
    private List<String> args;

    public UpperTransformer(List<String> args) {
        this.args = args;
    }

    public UpperTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    public String getName() {
        return "upper";
    }

    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (val == null) {
            return null;
        }

        if (val instanceof String) {
            return ((String) val).toUpperCase();
        }

        throw new IllegalArgumentException("upper: expected string. Got " + val);
    }
}
