package com.purescraps.purehtml.transformers.types;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.purescraps.purehtml.backend.PureHTMLNode;
import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;

public class UrlQueryParamTransformer extends Transformer {

    private List<String> args;

    // Constructor accepting query parameter keys
    @SuppressWarnings("unused")
    public UrlQueryParamTransformer(List<String> args) {
        this.args = args;
    }

    @SuppressWarnings("unused")
    public UrlQueryParamTransformer() {
        this.args = null;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }
    // Static method to return the name of the transformer

    public String getName() {
        return "urlQueryParam";
    }

    // The transform method that extracts query parameters from a URL string
    @Override
    public Object transform(TransformParams params) {
        /**
         * Extract query parameters from the URL and return them based on arguments.
         * 
         * @param params: The parameters that contain the URL and the element.
         * @return: A map of query parameters or a specific value if arguments are
         *          provided.
         */
        PureHTMLNode element = params.getElement(); // Get the HTML element
        String url = params.getUrl(); // Get the URL from params

        // Parse the query parameters from the URL
        Map<String, String> queryParams = parseQuery(url);
        Map<String, String> jsonObject = new HashMap<>();

        if (args.size() == 1) {
            // If one argument is provided, return the specific query parameter value
            String key = args.getFirst();
            if (queryParams.containsKey(key)) {
                return queryParams.get(key);
            }

            // If the query parameter is not found, return the element attribute if possible
            return element.attr().get(key); // Assuming `element.get()` gets the attribute value
        } else if (args.isEmpty()) {
            // If no arguments are provided, return all query parameters
            return queryParams;
        } else {
            // If multiple arguments are provided, return only the specified query
            // parameters
            for (String arg : args) {
                if (queryParams.containsKey(arg)) {
                    jsonObject.put(arg, queryParams.get(arg));
                }
            }
            return jsonObject;
        }
    }

    // Method to parse the query string from the URL
    private Map<String, String> parseQuery(String url) {
        Map<String, String> queryParams = new HashMap<>();

        // Assuming the URL is well-formed and contains a query string in the form
        // ?key=value&key2=value2
        if (url != null && url.contains("?")) {
            String queryString = url.split("\\?")[1];
            String[] pairs = queryString.split("&");

            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    queryParams.put(keyValue[0], keyValue[1]);
                }
            }
        }
        return queryParams;
    }
}
