package com.purescraps.purehtml.backend;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.ArrayList;
import java.util.List;

public class PureHTMLDocument {
    /**
     * A document implementation using JSoup.
     */
    private final Document document;

    public PureHTMLDocument(Document document) {
        this.document = document;
    }

    public List<PureHTMLNode> select(String selector) {
        /*
         * Select elements based on a CSS selector and wrap them in PureHTMLNode
         * objects.
         */
        Elements elements = document.select(selector);
        List<PureHTMLNode> nodes = new ArrayList<>();
        for (Element el : elements) {
            nodes.add(new PureHTMLNode(document, el));
        }
        return nodes;
    }

    public PureHTMLNode root() {
        /*
         * Return the root element of the document.
         */
        return new PureHTMLNode(document, document);
    }
}
