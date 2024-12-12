package com.purescraps.purehtml.configs.types;

import java.util.*;

import com.purescraps.purehtml.ExtractParamsBuilder;
import com.purescraps.purehtml.backend.PureHTMLNode;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.interfaces.ExtractParams;
import com.purescraps.purehtml.interfaces.GetSelectorMatchesParams;

public class ObjectConfig extends ConfigWithSelector {
    // Properties map: key-value pairs of property names and Config objects
    private Map<String, Config> properties = new HashMap<>();

    public ObjectConfig(String selector, Map<String, Config> properties) {
        super();
        this.selector = selector;
        this.setProperties(properties);
    }

    public void setProperties(Map<String, Config> properties) {
        this.properties = properties;
    }

    @Override
    public Object extract(ExtractParams params) {

        List<PureHTMLNode> parent = params.node();
        GetSelectorMatchesParams param = new GetSelectorMatchesParams() {
            @Override
            public boolean isAlreadyMatched() {
                return params.getElementAlreadyMatched();
            }

            @Override
            public boolean isIncludeRoot() {
                return false;
            }

        };

        PureHTMLNode element = this.getFirstMatch(parent, param, params.document());

        if ((element == null) && (this.selector != null))
            return null;

        Map<String, Config> props = this.properties;

        Map<String, Object> result = new HashMap<>();
        for (String key : props.keySet()) {
            Config config = props.get(key);

            ExtractParams extractParams = new ExtractParamsBuilder()
                    .setDocument(params.document())
                    .setNode(new ArrayList<>(Collections.singletonList(element)))
                    .setUrl(params.url())
                    .setElementAlreadyMatched(params.getElementAlreadyMatched())
                    .build();
            result.put(key, config.extract(extractParams));
        }
        return result;
    }
}
