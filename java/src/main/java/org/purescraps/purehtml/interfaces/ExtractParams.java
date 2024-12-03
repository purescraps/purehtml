package org.purescraps.purehtml.interfaces;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public interface ExtractParams {
    Document document();
    Elements node();
    String url();
    boolean getElementAlreadyMatched();
    Element element();
}

