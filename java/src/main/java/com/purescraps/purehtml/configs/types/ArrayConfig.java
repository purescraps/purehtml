package com.purescraps.purehtml.configs.types;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.purescraps.purehtml.ExtractParamsBuilder;
import com.purescraps.purehtml.backend.PureHTMLNode;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.interfaces.ExtractParams;
import com.purescraps.purehtml.interfaces.GetSelectorMatchesParams;
import com.purescraps.purehtml.transformers.Transformer;

public class ArrayConfig extends ConfigWithSelector {

    private final List<Transformer> transform; // A single transformer or a list of transformers
    private final Config items; // Config type for items

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

        GetSelectorMatchesParams selectorParams = new GetSelectorMatchesParams() {
            @Override
            public boolean isAlreadyMatched() {
                return params.getElementAlreadyMatched();
            }

            @Override
            public boolean isIncludeRoot() {
                return false;
            }

        };

        List<PureHTMLNode> elements = getAllMatches(params.node(), selectorParams, params.document());

        Config conf = items != null ? items : new PrimitiveValueConfig(null, transform);
        List<Object> result = new ArrayList<>();
        for (PureHTMLNode el : elements) {
            ExtractParams extractParams = new ExtractParamsBuilder()
                    .setDocument(params.document())
                    .setNode(new ArrayList<>(Collections.singletonList(el)))
                    .setUrl(params.url())
                    .setElementAlreadyMatched(params.getElementAlreadyMatched())
                    .build();
            result.add(conf.extract(extractParams));
        }
        return result;
    }
}
