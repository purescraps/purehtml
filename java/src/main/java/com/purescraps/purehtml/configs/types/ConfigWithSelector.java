package com.purescraps.purehtml.configs.types;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.purescraps.purehtml.backend.PureHTMLDocument;
import com.purescraps.purehtml.backend.PureHTMLNode;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.interfaces.GetSelectorMatchesParams;

public abstract class ConfigWithSelector extends Config {
    protected String selector;

    public List<PureHTMLNode> getAllMatches(List<PureHTMLNode> element,
            GetSelectorMatchesParams params, PureHTMLDocument doc) {
        /*
         * Get all matches according to the conditions described.
         * It returns the given element if it is already matched or if no selector is
         * provided.
         */
        if (selector == null) {
            return element;
        }

        if (params.isAlreadyMatched()) {
            return element;
        }

        if (element.isEmpty()) {
            return doc.select(this.selector);
        }

        if (params.isIncludeRoot()) {
            List<PureHTMLNode> matching = new ArrayList<>();
            for (PureHTMLNode node : element) {
                if (node.isSelector(this.selector)) {
                    matching.add(node);
                }
            }
            if (!matching.isEmpty()) {
                return matching;
            }
        }

        List<PureHTMLNode> results = new ArrayList<>();
        for (PureHTMLNode node : element) {
            results.addAll(node.find(this.selector));
        }
        return results;
    }

    public PureHTMLNode getFirstMatch(List<PureHTMLNode> element,
            GetSelectorMatchesParams params, PureHTMLDocument doc) {
        /*
         * Get the first match for the selector.
         */
        List<PureHTMLNode> matches = getAllMatches(element, params, doc);
        if (matches.isEmpty())
            return null;

        return matches.getFirst();

    }
}
