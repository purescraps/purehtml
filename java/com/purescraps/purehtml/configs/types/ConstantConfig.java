package com.purescraps.purehtml.configs.types;

import com.purescraps.purehtml.interfaces.ExtractParams;
import com.purescraps.purehtml.interfaces.GetSelectorMatchesParams;
import org.json.JSONStringer;
import org.jsoup.nodes.Document;

public class ConstantConfig extends ConfigWithSelector{
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
            // Get the matches based on the selector
            GetSelectorMatchesParams selectors = new GetSelectorMatchesParams() {
                @Override
                public boolean isAlreadyMatched() {
                    return false;
                }

                @Override
                public boolean isIncludeRoot() {
                    return true;
                }

                @Override
                public Document doc() {
                    return params.document();
                }
            };
            Object matches = this.getAllMatches(params.node(), selectors);
            // If no matches found, return null
            if (matches == null) {
                return null;
            }
            return JSONStringer.valueToString(val);
        }
        return JSONStringer.valueToString(val);
    }
}