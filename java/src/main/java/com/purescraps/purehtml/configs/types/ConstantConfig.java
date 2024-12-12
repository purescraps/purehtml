package com.purescraps.purehtml.configs.types;

import java.util.List;

import com.purescraps.purehtml.backend.PureHTMLNode;
import com.purescraps.purehtml.interfaces.ExtractParams;
import com.purescraps.purehtml.interfaces.GetSelectorMatchesParams;

public class ConstantConfig extends ConfigWithSelector {
    private final Object val;
    private final String selector;

    // constructor to initialize value and selector
    public ConstantConfig(Object val, String selector) {
        super();
        this.val = val;
        this.selector = selector;
    }

    @Override
    public Object extract(ExtractParams params) {
        if (this.selector != null) {
            GetSelectorMatchesParams selectors = new GetSelectorMatchesParams() {
                @Override
                public boolean isAlreadyMatched() {
                    return false;
                }

                @Override
                public boolean isIncludeRoot() {
                    return true;
                }

            };

            List<PureHTMLNode> matches = this.getAllMatches(params.node(), selectors, params.document());
            // If no matches found, return null
            if (matches == null) {
                return null;
            }
            return val;
        }
        return val;
    }
}