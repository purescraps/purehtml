package com.purescraps.purehtml.transformers.types;

import java.util.List;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class NumberTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String> args;

    @SuppressWarnings("unused")
    public NumberTransformer(List<String> args) {
        this.args = args;
    }

    @SuppressWarnings("unused")
    public NumberTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    // Static method to return the name of the transformer
    public String getName() {
        return "number";
    }

    // The transform method
    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();
        if (val == null) {
            return null;
        }
        if (val instanceof Number num) {
            double d = num.doubleValue();
            if (d == (long) d) {
                long l = (long) d;
                if (l >= Integer.MIN_VALUE && l <= Integer.MAX_VALUE) {
                    return (int) l;
                }
                return l;
            }
            return num;
        }
        if (val instanceof String) {
            double d = Double.parseDouble(val.toString().replace("\"", "").trim());
            if (d == (long) d) {
                long l = (long) d;
                if (l >= Integer.MIN_VALUE && l <= Integer.MAX_VALUE) {
                    return (int) l;
                }
                return l;
            }
            return d;
        }
        // If the value is not a valid type, throw an error
        System.out.println("NumberTransformer --> Not valid type.");
        System.exit(-1);
        return val;
    }
}
