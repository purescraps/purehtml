package com.purescraps.purehtml.backend;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class JsoupBackend {
    /**
     * A backend implementation using JSoup.
     */
    public static PureHTMLDocument load(String html) {
        /*
         * Load an HTML string into a PureHTMLDocument.
         */
        Document document = Jsoup.parse(html);
        return new PureHTMLDocument(document);
    }
}
