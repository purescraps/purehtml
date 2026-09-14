package com.purescraps.purehtml.configs.types;

import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.interfaces.ExtractParams;

public class DefaultValueConfig extends Config {
    private final Config config;
    private final Object defaultValue;

    // constructor
    public DefaultValueConfig(Config config, Object defaultValue) {
        super();
        this.config = config;
        this.defaultValue = defaultValue;
    }

    // The extract method
    @Override
    public Object extract(ExtractParams params) {
        Object result = config.extract(params);
        if (result == null) {
            return defaultValue;
        }
        return result;
    }
}
