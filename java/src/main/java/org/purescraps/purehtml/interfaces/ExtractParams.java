package org.purescraps.purehtml.interfaces;

import org.purescraps.purehtml.backend.PureHTMLDocument;
import org.purescraps.purehtml.backend.PureHTMLNode;

import java.util.ArrayList;

public interface ExtractParams {
    PureHTMLDocument document();

    ArrayList<PureHTMLNode> node();

    String url();

    boolean getElementAlreadyMatched();
}

