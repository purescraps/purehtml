package com.purescraps.purehtml.transformers.types;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

import java.util.List;

public class ExistsTransformer extends Transformer {
    private List<String>  args;
    public ExistsTransformer(List<String>  args) {
        this.args = args;
    }
    public ExistsTransformer(){
        this.args = null;
    }

    public void setArgs(List<String> args){
        this.args = args;
    }
        // Static method to get the name of the transformer
    public String getName() {
        return "exists";
    }

    // The transform method that checks if element is non-null
    @Override
    public Object transform(TransformParams params) {
        Object element = params.getElement();
        return element != null;
    }
}
