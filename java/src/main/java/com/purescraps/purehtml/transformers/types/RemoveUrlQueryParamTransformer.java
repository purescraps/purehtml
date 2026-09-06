package com.purescraps.purehtml.transformers.types;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

/**
 * removeUrlQueryParam: Remove query parameters from the url
 *
 * Usage:
 * removeUrlQueryParam(): all the query parameters will be removed
 * removeUrlQueryParam(foo): only the `foo` query parameter will be removed
 * removeUrlQueryParam(foo, bar): query parameters `foo` and `bar` will be
 * removed from the url
 */
public class RemoveUrlQueryParamTransformer extends Transformer {
    private List<String> args;

    public RemoveUrlQueryParamTransformer(List<String> args) {
        this.args = args;
    }

    public RemoveUrlQueryParamTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    // Static method to return the name of the transformer
    public String getName() {
        return "removeUrlQueryParam";
    }

    // The transform method that removes query parameters from a URL string
    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (!(val instanceof String)) {
            throw new IllegalArgumentException("removeUrlQueryParam: expected string. Got " + val);
        }

        try {
            URI uri = new URI((String) val);

            String newQuery;
            if (args == null || args.isEmpty()) {
                // clear all the search params if no arguments are given
                newQuery = null;
            } else {
                Set<String> toRemove = new HashSet<>(args);
                String query = uri.getQuery();
                List<String> keptPairs = new ArrayList<>();

                if (query != null && !query.isEmpty()) {
                    for (String pair : query.split("&")) {
                        String key = pair.contains("=") ? pair.substring(0, pair.indexOf('=')) : pair;
                        if (!toRemove.contains(key)) {
                            keptPairs.add(pair);
                        }
                    }
                }

                newQuery = keptPairs.isEmpty() ? null : String.join("&", keptPairs);
            }

            return new URI(uri.getScheme(), uri.getAuthority(), uri.getPath(), newQuery, uri.getFragment())
                    .toString();
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("removeUrlQueryParam: invalid URL: " + val, e);
        }
    }
}
