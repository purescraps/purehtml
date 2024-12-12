package com.purescraps.purehtml.transformers.types;

import java.util.List;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class TrimTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String> args;

    @SuppressWarnings("unused")
    public TrimTransformer(List<String> args) {
        this.args = args;
    }

    @SuppressWarnings("unused")
    public TrimTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    // Static method to return the name of the transformer
    public String getName() {
        return "trim";
    }

    // The transform method that trims the string
    @Override
    public String transform(TransformParams params) {
        Object val = params.getVal();

        // If the value is null, return null
        if (val == null) {
            return null;
        }

        // If the value is a string, trim it
        if (val instanceof String) {
            return val.toString().trim();
        }

        // If the value is not a string, throw an error
        System.out.println("Trim: invalid value type: " + val.getClass().getName());
        System.exit(-1);
        return null;
    }
}
