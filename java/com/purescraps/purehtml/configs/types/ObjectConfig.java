package com.purescraps.purehtml.configs.types;
import com.purescraps.purehtml.ExtractParamsBuilder;
import com.purescraps.purehtml.interfaces.ExtractParams;
import com.purescraps.purehtml.configs.Config;
import org.json.JSONStringer;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

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

        Map<String, Config> props = this.properties;
        Set<String> keys = props.keySet();

        Map<String, Object> result = new HashMap<>();
        for (String key : keys) {
            Config config = props.get(key);

            ExtractParams extractParams = new ExtractParamsBuilder()
                    .setDocument(params.document())
                    .setNode(params.node())
                    .setUrl(params.url())
                    .setElementAlreadyMatched(params.getElementAlreadyMatched())
                    .setElement(params.element())
                    .build();
                result.put(JSONStringer.valueToString(key), config.extract(extractParams));
            }
            return result;
    }
}

