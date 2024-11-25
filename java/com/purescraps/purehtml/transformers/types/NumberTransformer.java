package com.purescraps.purehtml.transformers.types;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

import java.util.List;

public class NumberTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String>  args;
    @SuppressWarnings("unused")
    public NumberTransformer(List<String>  args) {
        this.args = args;
    }
    @SuppressWarnings("unused")
    public NumberTransformer(){
        this.args = null;
    }

    public void setArgs(List<String> args){
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
        // If the value is a string, convert it to a number
        if (val instanceof String) {

            return Double.parseDouble(val.toString().replace("\"", "").trim());  // Using Double to represent numbers
        }
        if (val == null) {
            return null;
        }
        // If the value is not a valid type, throw an error
        System.out.println("NumberTransformer --> Not valid type.");
        System.exit(-1);
        return val;
    }
}
