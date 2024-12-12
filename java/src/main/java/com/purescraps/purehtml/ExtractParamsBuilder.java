package com.purescraps.purehtml;

import java.util.ArrayList;

import com.purescraps.purehtml.backend.PureHTMLDocument;
import com.purescraps.purehtml.backend.PureHTMLNode;
import com.purescraps.purehtml.interfaces.ExtractParams;

/**
 * Used for building Extract Params.
 */
public class ExtractParamsBuilder {

    private PureHTMLDocument document;
    private ArrayList<PureHTMLNode> node;
    private String url;
    private boolean elementAlreadyMatched;

    public ExtractParamsBuilder setDocument(PureHTMLDocument document) {
        this.document = document;
        return this;
    }

    public ExtractParamsBuilder setNode(ArrayList<PureHTMLNode> node) {
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

    public ExtractParams build() {
        return new ExtractParams() {

            @Override
            public PureHTMLDocument document() {
                return document;
            }

            @Override
            public ArrayList<PureHTMLNode> node() {
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

        };
    }
}
