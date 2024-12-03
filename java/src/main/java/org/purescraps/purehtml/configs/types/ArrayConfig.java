package org.purescraps.purehtml.configs.types;

import org.purescraps.purehtml.ExtractParamsBuilder;

import org.purescraps.purehtml.interfaces.ExtractParams;
import org.purescraps.purehtml.interfaces.GetSelectorMatchesParams;

import org.purescraps.purehtml.configs.Config;

import org.purescraps.purehtml.transformers.Transformer;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.util.List;
import java.util.ArrayList;

public class ArrayConfig extends ConfigWithSelector {

    private final List<Transformer> transform;  // A single transformer or a list of transformers
    private final Config items;        // Config type for items

    // constructor
    public ArrayConfig(String selector, Config items, List<Transformer> transform) {
        super();
        this.selector = selector;
        this.items = items;
        this.transform = transform;
    }
    // Extract method implementation
    @Override
    public Object extract(ExtractParams params) {
        // Get all matches for the element
        GetSelectorMatchesParams selectorParams = new GetSelectorMatchesParams() {
            @Override
            public boolean isAlreadyMatched() {
                return params.getElementAlreadyMatched();
            }

            @Override
            public boolean isIncludeRoot() {
                return false;
            }

            @Override
            public Document doc() {
                return params.document();
            }
        };
        Object elements = getAllMatches(params.node(), selectorParams);
        List<Object> matches = new ArrayList<>();
        if (elements instanceof List) {
            matches.addAll((List<?>) elements);
        } else {
            matches.add(elements);
        }
        Config conf = items != null ? items : new PrimitiveValueConfig(null, transform);
        List<Object> result = new ArrayList<>();
        for (Object el : matches) {
            ExtractParams extractParams = new ExtractParamsBuilder()
                    .setDocument(params.document())
                    .setNode(params.node())
                    .setUrl(params.url())
                    .setElementAlreadyMatched(params.getElementAlreadyMatched())
                    .setElement((Element) el)
                    .build();
            result.add(conf.extract(extractParams));
            if(items!=null)
            {
                if(items instanceof UnionConfig )
                    return result;
            }
        }
        return result;
    }
}
