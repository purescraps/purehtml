package com.purescraps.purehtml.configs.types;

import com.purescraps.purehtml.interfaces.GetSelectorMatchesParams;
import com.purescraps.purehtml.configs.Config;
import org.jsoup.select.Elements;


public abstract class  ConfigWithSelector extends Config {
    protected String selector;

    public Object getAllMatches(Elements elements, GetSelectorMatchesParams params) {
        if (params.isAlreadyMatched()) {
            return elements;
        }
        if (this.selector == null) {
            return elements;
        }
        if(elements == null && params.isIncludeRoot())
        {
            elements = params.doc().select(selector);
            if(!elements.isEmpty())
                return elements;
            return null;
        }

        if (params.isIncludeRoot()) {
            assert elements != null;
            if (elements.is(this.selector)) {

                return elements;
            }
        }

        //Here is needed the doc, we will select new elements with new selector.
        return params.doc().select(selector);
    }

    public Object getFirst(Elements elements, GetSelectorMatchesParams params) {
        Object matches = getAllMatches(elements, params);
        if (matches instanceof Elements) {
            return ((Elements) matches).getFirst();
        }
        return matches;  // If it's not a list, return the element itself
    }
    public Object getAtIndex (Elements elements, GetSelectorMatchesParams params, int index){
        Object matches = getAllMatches(elements,params);
        return ((Elements) matches).get(index);
    }
}
