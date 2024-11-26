package org.purescraps.purehtml.transformers.types;

import org.purescraps.purehtml.transformers.TransformParams;
import org.purescraps.purehtml.transformers.Transformer;

import java.util.List;

public class ExistsTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String>  args;
    @SuppressWarnings("unused")
    public ExistsTransformer(List<String>  args) {
        this.args = args;
    }
    @SuppressWarnings("unused")
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
