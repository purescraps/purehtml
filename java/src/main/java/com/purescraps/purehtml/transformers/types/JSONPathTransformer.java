package com.purescraps.purehtml.transformers.types;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

/**
 * jsonpath: Extract a value from a parsed JSON value by path
 *
 * Usage:
 * jsonpath(path): navigates a JSON value (typically the output of `json`)
 * using dot notation for object keys (`$.a.b`) and bracket notation for
 * array indices or keys with special characters (`$.a[0]`, `$["a-b"]`).
 * Negative indices count from the end of the array. Returns null when the
 * path does not resolve to a value.
 */
public class JSONPathTransformer extends Transformer {
    private List<String> args;

    public JSONPathTransformer(List<String> args) {
        this.args = args;
    }

    public JSONPathTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    public String getName() {
        return "jsonpath";
    }

    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (val == null) {
            return null;
        }

        if (args == null || args.isEmpty()) {
            throw new IllegalArgumentException("jsonpath: requires a path, e.g. jsonpath(\"$.a.b\")");
        }

        List<Segment> segments = parsePath(args.get(0));
        return evaluate(val, segments);
    }

    private abstract static class Segment {
    }

    private static final class KeySegment extends Segment {
        final String key;

        KeySegment(String key) {
            this.key = key;
        }
    }

    private static final class IndexSegment extends Segment {
        final int index;

        IndexSegment(int index) {
            this.index = index;
        }
    }

    private static boolean isIdentChar(char c) {
        return Character.isLetterOrDigit(c) || c == '_';
    }

    private static List<Segment> parsePath(String path) {
        if (path == null || path.isEmpty() || path.charAt(0) != '$') {
            throw new IllegalArgumentException("jsonpath: invalid path \"" + path + "\": must start with \"$\"");
        }

        List<Segment> segments = new ArrayList<>();
        int i = 1;
        int n = path.length();

        while (i < n) {
            char ch = path.charAt(i);
            if (ch == '.') {
                i++;
                int start = i;
                while (i < n && isIdentChar(path.charAt(i))) {
                    i++;
                }
                if (i == start) {
                    throw new IllegalArgumentException(
                            "jsonpath: invalid path \"" + path + "\": expected a name after \".\"");
                }
                segments.add(new KeySegment(path.substring(start, i)));
            } else if (ch == '[') {
                i++;
                if (i >= n) {
                    throw new IllegalArgumentException(
                            "jsonpath: invalid path \"" + path + "\": unterminated \"[\"");
                }
                char next = path.charAt(i);
                if (next == '"' || next == '\'') {
                    char quote = next;
                    i++;
                    StringBuilder key = new StringBuilder();
                    while (i < n && path.charAt(i) != quote) {
                        char c = path.charAt(i);
                        char nextChar = (i + 1 < n) ? path.charAt(i + 1) : '\0';
                        if (c == '\\' && i + 1 < n && (nextChar == quote || nextChar == '\\')) {
                            key.append(nextChar);
                            i += 2;
                        } else {
                            key.append(c);
                            i++;
                        }
                    }
                    if (i >= n) {
                        throw new IllegalArgumentException(
                                "jsonpath: invalid path \"" + path + "\": unterminated quoted key");
                    }
                    i++; // skip closing quote
                    segments.add(new KeySegment(key.toString()));
                } else if (next == '-' || Character.isDigit(next)) {
                    int start = i;
                    if (next == '-') {
                        i++;
                    }
                    int digitsStart = i;
                    while (i < n && Character.isDigit(path.charAt(i))) {
                        i++;
                    }
                    if (i == digitsStart) {
                        throw new IllegalArgumentException(
                                "jsonpath: invalid path \"" + path + "\": expected an index inside \"[]\"");
                    }
                    segments.add(new IndexSegment(Integer.parseInt(path.substring(start, i))));
                } else {
                    throw new IllegalArgumentException(
                            "jsonpath: invalid path \"" + path + "\": expected an index or quoted key inside \"[]\"");
                }
                if (i >= n || path.charAt(i) != ']') {
                    throw new IllegalArgumentException(
                            "jsonpath: invalid path \"" + path + "\": expected \"]\"");
                }
                i++;
            } else {
                throw new IllegalArgumentException(
                        "jsonpath: invalid path \"" + path + "\": unexpected character '" + ch + "' at position " + i);
            }
        }

        return segments;
    }

    @SuppressWarnings("unchecked")
    private static Object evaluate(Object root, List<Segment> segments) {
        Object current = root;

        for (Segment segment : segments) {
            if (current == null) {
                return null;
            }

            if (segment instanceof IndexSegment) {
                if (!(current instanceof List)) {
                    return null;
                }
                List<Object> list = (List<Object>) current;
                int index = ((IndexSegment) segment).index;
                if (index < 0) {
                    index += list.size();
                }
                if (index < 0 || index >= list.size()) {
                    return null;
                }
                current = list.get(index);
            } else {
                if (!(current instanceof Map)) {
                    return null;
                }
                Map<Object, Object> map = (Map<Object, Object>) current;
                String key = ((KeySegment) segment).key;
                if (!map.containsKey(key)) {
                    return null;
                }
                current = map.get(key);
            }
        }

        return current;
    }
}
