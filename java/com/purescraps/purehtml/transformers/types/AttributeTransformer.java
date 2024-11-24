package com.purescraps.purehtml.transformers.types;
import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;
import org.json.JSONObject;
import org.json.JSONStringer;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.Element;

import java.util.List;

public class AttributeTransformer extends Transformer {

    private List<String> args;

    // Constructor that accepts attribute names as arguments

    public AttributeTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    // Static method to return the name of the transformer
    public String getName() {
        return "attr";
    }

    // The transform method that retrieves the HTML element's attributes
    @Override
    public Object transform(TransformParams params) {

        Element element = params.getElement();
        JSONObject jsonObject = new JSONObject();
        if (args.size() == 1)
        {
            return JSONStringer.valueToString(element.attr(args.getFirst().replaceAll("[()]", "")));
        }
        else if (args.isEmpty()) {
            for (Attribute x : element.attributes())
                jsonObject.put(x.getKey(), x.getValue());
        } else {
            for (String arg : args) {
                jsonObject.put(arg, element.attr(arg));
            }
        }
        return jsonObject;
    }
}

