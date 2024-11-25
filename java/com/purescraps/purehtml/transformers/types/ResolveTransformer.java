package com.purescraps.purehtml.transformers.types;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

public class ResolveTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String>  args;
    @SuppressWarnings("unused")
    public ResolveTransformer(List<String>  args) {
        this.args = args;
    }
    @SuppressWarnings("unused")
    public ResolveTransformer(){
        this.args = null;
    }

    public void setArgs(List<String> args){
        this.args = args;
    }
    // Static method to return the name of the transformer
    public String getName() {
        return "resolve";
    }

    // The transform method that resolves the URL
    public Object transform(TransformParams params) {
        String val = (String) params.getVal();
        String url = params.getUrl();  // Base URL from params

        if (val != null) {
            try {
                URI baseUri = new URI(url);
                URI resolvedUri = baseUri.resolve(val);  // Resolve the relative URL

                return resolvedUri.toString();  // Return the resolved URI as a string
            } catch (URISyntaxException e) {
                System.out.println(e.getMessage());
            }
        }
        System.out.println("ResolveTransformer.transform: invalid value type: " + (val == null ? "null" : val.getClass().getSimpleName()));
        System.exit(-1);
        return null;
    }
}