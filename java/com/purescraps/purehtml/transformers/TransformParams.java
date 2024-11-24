package com.purescraps.purehtml.transformers;

import org.jsoup.nodes.Element;

public class TransformParams {

    private Object val;
    private Element element;
    private final String url;

    // Constructor
    public TransformParams(Object val, Element element, String url) {
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

    public Element getElement() {
        return element;
    }

    public void setElement(Element $el) {
        this.element = $el;
    }

    public String getUrl() {
        return url;
    }

}
