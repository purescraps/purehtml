package com.purescraps.purehtml.transformers.types;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class RemoveLastPathSectionTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String> args;

    @SuppressWarnings("unused")
    public RemoveLastPathSectionTransformer(List<String> args) {
        this.args = args;
    }

    @SuppressWarnings("unused")
    public RemoveLastPathSectionTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    // Static method to return the name of the transformer
    public String getName() {
        return "removeLastPathSection";
    }

    // The transform method that removes the last section of the URL's path
    @Override
    public Object transform(TransformParams params) {
        Object val = params.getVal();

        if (val == null) {
            return null;
        }

        if (!(val instanceof String)) {
            throw new IllegalArgumentException("removeLastPathSection: expects string. Got " + val);
        }

        try {
            URI uri = new URI((String) val);
            String path = uri.getPath() == null ? "" : uri.getPath();

            List<String> sections = new ArrayList<>(Arrays.asList(path.split("/", -1)));
            if (!sections.isEmpty()) {
                sections.remove(sections.size() - 1);
            }

            String newPath = String.join("/", sections);
            if (newPath.isEmpty()) {
                newPath = "/";
            }

            return new URI(uri.getScheme(), uri.getAuthority(), newPath, uri.getQuery(), uri.getFragment())
                    .toString();
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("removeLastPathSection: invalid URL: " + val, e);
        }
    }
}
