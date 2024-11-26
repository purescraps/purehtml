package org.purescraps.purehtml.configs.types;
import org.purescraps.purehtml.interfaces.ExtractParams;
import org.purescraps.purehtml.interfaces.GetSelectorMatchesParams;

import org.purescraps.purehtml.transformers.Transformer;
import org.purescraps.purehtml.transformers.TransformParams;

import org.json.JSONStringer;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.util.List;
import java.util.ArrayList;

public class PrimitiveValueConfig extends ConfigWithSelector {

    private List<Transformer> transform = new ArrayList<>();  // List to store transformers
    public PrimitiveValueConfig(String selector, List<Transformer> transform) {
        super();
        if (transform != null) {
            this.transform = transform;
        }
        this.selector = selector;
    }

    public Object extract(ExtractParams params) {

        String val = null;
        Element node = null;
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
        if(params.element() != null)
        {
            val = params.element().text();
            if (transform.isEmpty()) {
                return JSONStringer.valueToString(val);
            }
            TransformParams tParams = new TransformParams(val, params.element(), params.url());
            return transformVal(transform, tParams, val);
        }
        //if no element is given, we will search for elements with the selector of this config.
        Object elements = getFirst(params.node(), selectorParams);
        //if elements is an Element type, then we will get the text and apply transforms if any.
        if(elements instanceof Element)
        {
            val= ((Element) elements).text();
            node = ((Element) elements);
        }
        //No transform, return the value directly with JSONStringer.
        if (transform.isEmpty()) {
            return JSONStringer.valueToString(val);
        }
        //Ready the tParams, it will be utilised by transformers.
        TransformParams tParams = new TransformParams(val, node, params.url());
        //get the text from element, which will be the value for transformers to modify.
        if (node != null) {
            val = node.text();
        }
        return transformVal(transform, tParams, val);
    }
    // Helper method to apply transformations
    @SuppressWarnings("unchecked")
    protected Object transformVal(Object transformer, TransformParams transformParams, Object val)
    {
        if (transformer instanceof Transformer) {
            return ((Transformer) transformer).transform(transformParams);
        }
        // If transformer is a List of Transformers, apply them sequentially
        if (transformer instanceof List<?>) {
            Object acc = val;
            List<Transformer> transformers = (List<Transformer>) transformer;
            for (Transformer tr : transformers) {
                if(tr != null)
                {
                    acc = tr.transform(transformParams);
                    transformParams.setVal(acc);
                }
            }
            return acc;
        }
        return transformer;
    }
}
