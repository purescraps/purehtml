package org.purescraps.purehtml.transformers.types;

import org.jsoup.nodes.Attribute;
import org.purescraps.purehtml.backend.PureHTMLNode;
import org.purescraps.purehtml.transformers.TransformParams;
import org.purescraps.purehtml.transformers.Transformer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        /**
         * Retrieve the attributes of the HTML element.
         * @param params: The parameters that contain the element to extract attributes from.
         * @return: A map of attributes if multiple are requested, or a single attribute value.
         */
        PureHTMLNode element = params.getElement();
        Map<String, String> attributes = new HashMap<>();

        if (args.size() == 1) {
            // If only one argument is provided, return the value of that attribute
            String attributeName = args.getFirst().replace("(", "").replace(")", "");
            return element.attr(attributeName);
        } else if (args.isEmpty()) {
            // If no arguments are provided, return all attributes
            return element.attr().asList().stream()
                    .collect(Collectors.toMap(Attribute::getKey, Attribute::getValue));
        } else {
            // If multiple arguments are provided, return the specified attributes
            for (String arg : args) {
                attributes.put(arg, element.attr().get(arg)); // Assuming `get` fetches the attribute by name
            }
        }
        System.out.println(attributes);
        return attributes;
    }
}

