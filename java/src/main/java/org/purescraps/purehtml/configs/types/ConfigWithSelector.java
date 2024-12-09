package org.purescraps.purehtml.configs.types;

import org.purescraps.purehtml.backend.PureHTMLDocument;
import org.purescraps.purehtml.backend.PureHTMLNode;
import org.purescraps.purehtml.configs.Config;
import org.purescraps.purehtml.interfaces.GetSelectorMatchesParams;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public abstract class ConfigWithSelector extends Config {
    protected String selector;

    public List<PureHTMLNode> getAllMatches(List<PureHTMLNode> element,
                                            GetSelectorMatchesParams params, PureHTMLDocument doc) {
        /*
         * Get all matches according to the conditions described.
         * It returns the given element if it is already matched or if no selector is provided.
         */
        if (selector == null) {
            return element;
        }

        if (params.isAlreadyMatched()) {
            return element;
        }

        if (params.isIncludeRoot()) {
            if (element.isEmpty()) {
                List<PureHTMLNode> root = doc.select(this.selector);

                for (PureHTMLNode node : root) {
                    if (node.isSelector(this.selector)) {
                        return Collections.singletonList(node);

                    } else {
                        return root;
                    }
                }
            } else {
                for (PureHTMLNode node : element) {
                    if (node.isSelector(this.selector)) {
                        return Collections.singletonList(node);
                    }
                }
                return new ArrayList<>();
            }
        }

        if (element.isEmpty()) {
            List<PureHTMLNode> nodes = doc.select(selector);
            List<PureHTMLNode> results = new ArrayList<>();

            for (PureHTMLNode node : nodes) {
                if (params.isIncludeRoot()) {
                    results = node.find(selector);
                }
            }
            return params.isIncludeRoot() ? results : nodes;

        } else {
            return element.getFirst().find(selector);

        }
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


