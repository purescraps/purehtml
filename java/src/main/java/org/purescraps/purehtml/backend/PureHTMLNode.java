package org.purescraps.purehtml.backend;

import org.jsoup.nodes.Attributes;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.ArrayList;
import java.util.List;

public class PureHTMLNode {
    /**
     * A node implementation using JSoup.
     */
    private final Document document;
    private final Element element;

    public PureHTMLNode(Document document, Element element) {
        this.document = document;
        this.element = element;
    }

    public String attr(String name) {
        /**
         * Get a specific attribute of the node.
         */
        return element.attr(name);
    }


    public Attributes attr() {
        return element.attributes();
    }

    public List<PureHTMLNode> find(String selector) {
        /*
         * Find child elements based on a CSS selector and wrap them in PureHTMLNode objects.
         */
        Elements elements;
        if (this.element == this.document) {
            elements = this.document.select(selector);
        } else {
            elements = this.element.children().select(selector);
        }
        List<PureHTMLNode> nodes = new ArrayList<>();
        for (Element el : elements) {
            nodes.add(new PureHTMLNode(document, el));
        }
        return nodes;
    }

    public String html() {
        /*
         * Get the HTML content of the node.
         */
        return element.html();
    }

    public boolean isSelector(String selector) {
        /*
         * Check if the node matches the selector.
         */
        Elements matchedElements = document.select(selector);
        return matchedElements.contains(element);
    }

    public String text() {
        /*
         * Get the text content of the node.
         */
        return element.text();
    }
}