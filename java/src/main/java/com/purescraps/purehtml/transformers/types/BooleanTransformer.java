package com.purescraps.purehtml.transformers.types;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

/**
 * boolean: Explicitly cast any value to a boolean using truthy semantics.
 *
 * Unlike `exists` (which reports whether an element/attribute is present),
 * `boolean` casts the value itself: null, "", 0, false, and empty
 * collections/maps are false; everything else is true.
 */
public class BooleanTransformer extends Transformer {
    private List<String> args;

    public BooleanTransformer(List<String> args) {
        this.args = args;
    }

    public BooleanTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    public String getName() {
        return "boolean";
    }

    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (val == null) {
            return false;
        }
        if (val instanceof Boolean) {
            return val;
        }
        if (val instanceof String) {
            return !((String) val).isEmpty();
        }
        if (val instanceof Number) {
            return ((Number) val).doubleValue() != 0;
        }
        if (val instanceof Collection) {
            return !((Collection<?>) val).isEmpty();
        }
        if (val instanceof Map) {
            return !((Map<?, ?>) val).isEmpty();
        }
        return true;
    }
}
