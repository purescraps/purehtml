package com.purescraps.purehtml.transformers.types;

import java.util.List;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class LowerTransformer extends Transformer {
    private List<String> args;

    public LowerTransformer(List<String> args) {
        this.args = args;
    }

    public LowerTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    public String getName() {
        return "lower";
    }

    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (val == null) {
            return null;
        }

        if (val instanceof String) {
            return ((String) val).toLowerCase();
        }

        throw new IllegalArgumentException("lower: expected string. Got " + val);
    }
}
