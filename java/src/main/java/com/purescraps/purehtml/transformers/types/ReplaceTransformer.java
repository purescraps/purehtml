package com.purescraps.purehtml.transformers.types;

import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

/**
 * replace: Replace regex/string matches in a string
 *
 * Usage:
 * replace(pattern, replacement): replaces every match of `pattern` (a
 * regular expression) with `replacement`. `replacement` may reference
 * capture groups using $1, $2, etc.
 */
public class ReplaceTransformer extends Transformer {
    private List<String> args;

    public ReplaceTransformer(List<String> args) {
        this.args = args;
    }

    public ReplaceTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    public String getName() {
        return "replace";
    }

    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (val == null) {
            return null;
        }

        if (!(val instanceof String)) {
            throw new IllegalArgumentException("replace: expected string. Got " + val);
        }

        if (args == null || args.size() < 2) {
            throw new IllegalArgumentException(
                    "replace: requires a pattern and a replacement, e.g. replace(\\s+, ' ')");
        }

        try {
            Pattern pattern = Pattern.compile(args.get(0));
            return pattern.matcher((String) val).replaceAll(args.get(1));
        } catch (PatternSyntaxException e) {
            throw new IllegalArgumentException("replace: invalid pattern: " + args.get(0), e);
        }
    }
}
