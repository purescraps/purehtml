package org.purescraps.purehtml.configs.types;

import org.purescraps.purehtml.backend.PureHTMLNode;
import org.purescraps.purehtml.interfaces.ExtractParams;
import org.purescraps.purehtml.interfaces.GetSelectorMatchesParams;
import org.purescraps.purehtml.transformers.TransformParams;
import org.purescraps.purehtml.transformers.Transformer;

import java.util.ArrayList;
import java.util.List;

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

        /*
         * Extracts a value from the parameters, applying any transformations if available.
         * @param params: The ExtractParams object containing context for extraction.
         * @return: The extracted and transformed value as a String.
         */
        String val = null;

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

        PureHTMLNode selectedElement = getFirstMatch(params.node(), selectorParams, params.document());

        if (selectedElement != null) {
            val = selectedElement.text();
        }

        // If no transformation is required, return the value as is
        if (transform == null) {
            return val;
        }

        // Applying transformation
        TransformParams transformParams = new TransformParams(val, selectedElement, params.url());
        return this.transformVal(transform, transformParams, val);
    }

    protected Object transformVal(Object transformer, TransformParams transformParams, Object val) {
        if (transformer instanceof Transformer) {
            return ((Transformer) transformer).transform(transformParams);
        }
        // If transformer is a List of Transformers, apply them sequentially
        if (transformer instanceof List<?>) {
            Object acc = val;
            List<Transformer> transformers = (List<Transformer>) transformer;
            for (Transformer tr : transformers) {
                if (tr != null) {
                    acc = tr.transform(transformParams);
                    transformParams.setVal(acc);
                }
            }
            return acc;
        }
        return transformer;
    }
}
