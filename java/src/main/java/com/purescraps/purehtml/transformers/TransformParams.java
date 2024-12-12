package com.purescraps.purehtml.transformers;

import com.purescraps.purehtml.backend.PureHTMLNode;

public class TransformParams {

    private final String url;
    private Object val;
    private PureHTMLNode element;

    // Constructor
    public TransformParams(Object val, PureHTMLNode element, String url) {
        this.val = val;
        this.element = element;
        this.url = url;
    }

    // Getters and Setters
    public Object getVal() {
        return val;
    }

    public void setVal(Object val) {
        this.val = val;
    }

    public PureHTMLNode getElement() {
        return element;
    }

    public void setElement(PureHTMLNode $el) {
        this.element = $el;
    }

    public String getUrl() {
        return url;
    }

}
