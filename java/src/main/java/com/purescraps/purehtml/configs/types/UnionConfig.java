package com.purescraps.purehtml.configs.types;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.purescraps.purehtml.ExtractParamsBuilder;
import com.purescraps.purehtml.backend.PureHTMLNode;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.interfaces.ExtractParams;
import com.purescraps.purehtml.interfaces.GetSelectorMatchesParams;

public class UnionConfig extends Config {
    private final List<Config> configs;

    // constructor
    public UnionConfig(List<Config> configs) {
        super();
        this.configs = configs;
    }

    // The extract method
    public Object extract(ExtractParams params) {

        List<PureHTMLNode> parentElement = params.node();
        for (Config config : configs) {
            if (config instanceof ConfigWithSelector configWithSelector) {
                GetSelectorMatchesParams param = new GetSelectorMatchesParams() {
                    @Override
                    public boolean isAlreadyMatched() {
                        return false;
                    }

                    @Override
                    public boolean isIncludeRoot() {
                        return true;
                    }

                };

                List<PureHTMLNode> matches = configWithSelector.getAllMatches(parentElement, param, params.document());
                if ((matches == null || matches.isEmpty()) && !(config instanceof ConstantConfig)) {
                    continue;
                }

                boolean isArray = matches != null && matches.size() > 1;
                List<PureHTMLNode> matchedNode = isArray ? parentElement : (matches != null ? matches : new ArrayList<>());
                boolean elementAlreadyMatched = !isArray;

                ExtractParams extractParams = new ExtractParamsBuilder()
                        .setDocument(params.document())
                        .setNode(new ArrayList<>(matchedNode))
                        .setUrl(params.url())
                        .setElementAlreadyMatched(elementAlreadyMatched)
                        .build();
                return config.extract(extractParams);
            } else {
                ExtractParams extractParams = new ExtractParamsBuilder()
                        .setDocument(params.document())
                        .setNode(new ArrayList<>(parentElement))
                        .setUrl(params.url())
                        .setElementAlreadyMatched(params.getElementAlreadyMatched())
                        .build();
                Object val = config.extract(extractParams);
                if (val != null) {
                    return val;
                }
            }

        }

        return null;
    }

}
