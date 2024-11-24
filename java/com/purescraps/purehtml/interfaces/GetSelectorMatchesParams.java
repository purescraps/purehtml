package com.purescraps.purehtml.interfaces;

import org.jsoup.nodes.Document;

public interface GetSelectorMatchesParams {
    boolean isAlreadyMatched();
    boolean isIncludeRoot();
    Document doc();
}
