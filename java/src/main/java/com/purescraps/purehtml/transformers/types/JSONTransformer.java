package com.purescraps.purehtml.transformers.types;

import java.util.List;

import org.yaml.snakeyaml.Yaml;

import com.purescraps.purehtml.backend.PureHTMLNode;
import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class JSONTransformer extends Transformer {
    @SuppressWarnings("unused")
    private List<String> args;

    @SuppressWarnings("unused")
    public JSONTransformer(List<String> args) {
        this.args = args;
    }

    @SuppressWarnings("unused")
    public JSONTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    // Static method to return the name of the transformer
    public String getName() {
        return "json";
    }

    // The transform method that parses the element's text content as JSON
    @Override
    public Object transform(TransformParams params) {
        PureHTMLNode element = params.getElement();

        if (element == null) {
            return null;
        }

        // `<script>`/`<style>` content is not exposed through text(), so prefer the
        // raw node data (falls back to text() for regular elements).
        String content = element.data();
        if (content == null || content.isBlank()) {
            content = element.text();
        }

        // JSON is a subset of YAML, so parsing it with the YAML parser yields plain
        // Map/List/String/Number/Boolean values, same as every other config value.
        return new Yaml().load(content);
    }
}
