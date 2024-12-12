package com.purescraps.purehtml.transformers.types;

import java.util.List;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class LengthTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String> args;

    @SuppressWarnings("unused")
    public LengthTransformer(List<String> args) {
        this.args = args;
    }

    @SuppressWarnings("unused")
    public LengthTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    // Static method to return the name of the transformer
    public String getName() {
        return "length";
    }

    // The transform method that returns the length of a string or an array
    public Integer transform(TransformParams params) {
        Object val = params.getVal();

        // If the value is null, return null
        if (val == null) {
            return null;
        }

        // If the value is a String or an array, return the length
        if (val instanceof String) {
            return ((String) val).length();
        } else if (val.getClass().isArray()) {
            return java.lang.reflect.Array.getLength(val);
        }

        // If the value is neither a String nor an array, throw an error
        System.out.println("Length.transform: invalid value type: " + val.getClass().getName());
        System.exit(-1);
        return 0;
    }
}