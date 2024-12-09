package org.purescraps.purehtml.transformers;

import java.util.List;

public abstract class Transformer {
    public abstract void setArgs(List<String> args);

    // Static method to get the name, throwing an exception if not implemented
    public String getName() {
        throw new UnsupportedOperationException("Not implemented");
    }

    // Abstract method to transform the input based on parameters
    public abstract Object transform(TransformParams params);
}
