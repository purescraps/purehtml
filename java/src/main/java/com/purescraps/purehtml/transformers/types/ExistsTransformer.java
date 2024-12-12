package com.purescraps.purehtml.transformers.types;

import java.util.List;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class ExistsTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String> args;

    @SuppressWarnings("unused")
    public ExistsTransformer(List<String> args) {
        this.args = args;
    }

    @SuppressWarnings("unused")
    public ExistsTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
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
