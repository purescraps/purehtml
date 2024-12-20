package com.purescraps.purehtml.transformers.types;

import java.util.List;

import com.purescraps.purehtml.backend.PureHTMLNode;
import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class HTMLTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String> args;

    @SuppressWarnings("unused")
    public HTMLTransformer(List<String> args) {
        this.args = args;
    }

    @SuppressWarnings("unused")
    public HTMLTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    // Static method to return the name of the transformer
    public String getName() {
        return "html";
    }

    // The transform method that returns the HTML content of the element
    @Override
    public Object transform(TransformParams params) {
        // Retrieve elements from the TransformParams object
        PureHTMLNode elements = params.getElement();
        // If elements is not null, call html() method; otherwise, return null
        if (elements != null) {
            return elements.html(); // Assuming html() is a method in HTMLNode
        }
        return "";
    }
}
