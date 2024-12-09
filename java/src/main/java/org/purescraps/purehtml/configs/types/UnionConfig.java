package org.purescraps.purehtml.configs.types;

import org.purescraps.purehtml.ExtractParamsBuilder;
import org.purescraps.purehtml.backend.PureHTMLNode;
import org.purescraps.purehtml.configs.Config;
import org.purescraps.purehtml.interfaces.ExtractParams;
import org.purescraps.purehtml.interfaces.GetSelectorMatchesParams;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UnionConfig extends Config {
    private final List<Config> configs;

    //constructor
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

                PureHTMLNode elements = configWithSelector.getFirstMatch(parentElement, param, params.document());
                if (elements == null && !(config instanceof ConstantConfig)) {
                    continue;
                }

                ExtractParams extractParams = new ExtractParamsBuilder()
                        .setDocument(params.document())
                        .setNode(new ArrayList<>(Collections.singletonList(elements)))
                        .setUrl(params.url())
                        .setElementAlreadyMatched(true)
                        .build();
                return config.extract(extractParams);
            } else {
                ExtractParams extractParams = new ExtractParamsBuilder()
                        .setDocument(params.document())
                        .setNode(params.node())
                        .setUrl(params.url())
                        .setElementAlreadyMatched(params.getElementAlreadyMatched())
                        .build();
                return config.extract(extractParams);
            }

        }

        return null;
    }

}
