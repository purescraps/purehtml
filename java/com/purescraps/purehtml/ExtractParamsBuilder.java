package com.purescraps.purehtml;

import com.purescraps.purehtml.interfaces.ExtractParams;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class ExtractParamsBuilder {

    private Document document;
    private Elements node;
    private String url;
    private boolean elementAlreadyMatched;
    private Element element;

    public ExtractParamsBuilder setDocument(Document document) {
        this.document = document;
        return this;
    }

    public ExtractParamsBuilder setNode(Elements node) {
        this.node = node;
        return this;
    }

    public ExtractParamsBuilder setUrl(String url) {
        this.url = url;
        return this;
    }

    public ExtractParamsBuilder setElementAlreadyMatched(boolean elementAlreadyMatched) {
        this.elementAlreadyMatched = elementAlreadyMatched;
        return this;
    }

    public ExtractParamsBuilder setElement(Element element) {
        this.element = element;
        return this;
    }

    public ExtractParams build() {
        return new ExtractParams() {

            @Override
            public Document document() {
                return document;
            }

            @Override
            public Elements node() {
                return node;
            }

            @Override
            public String url() {
                return url;
            }

            @Override
            public boolean getElementAlreadyMatched() {
                return elementAlreadyMatched;
            }

            @Override
            public Element element() {
                return element;
            }
        };
    }
}
