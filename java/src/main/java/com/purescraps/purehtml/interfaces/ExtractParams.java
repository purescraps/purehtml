package com.purescraps.purehtml.interfaces;

import java.util.ArrayList;

import com.purescraps.purehtml.backend.PureHTMLDocument;
import com.purescraps.purehtml.backend.PureHTMLNode;

public interface ExtractParams {
    PureHTMLDocument document();

    ArrayList<PureHTMLNode> node();

    String url();

    boolean getElementAlreadyMatched();
}
