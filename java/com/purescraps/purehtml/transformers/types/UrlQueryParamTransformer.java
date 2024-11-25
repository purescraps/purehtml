package com.purescraps.purehtml.transformers.types;

import com.purescraps.purehtml.transformers.TransformParams;
import com.purescraps.purehtml.transformers.Transformer;
import org.json.JSONObject;
import org.json.JSONStringer;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.UnsupportedEncodingException;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UrlQueryParamTransformer extends Transformer {

    private List<String>  args;
    // Constructor accepting query parameter keys
    @SuppressWarnings("unused")
    public UrlQueryParamTransformer(List<String>  args) {
        this.args = args;
    }
    @SuppressWarnings("unused")
    public UrlQueryParamTransformer(){
        this.args = null;
    }

    public void setArgs(List<String> args){
        this.args = args;
    }
    // Static method to return the name of the transformer

    public String getName() {
        return "urlQueryParam";
    }

    // The transform method that extracts query parameters from a URL string
    @Override
    public Object transform(TransformParams params) {

        Element element = params.getElement();
        JSONObject jsonObject = new JSONObject();
        try {
            Document doc = Jsoup.parse(params.getUrl());
            URL parsedUrl = new URI(doc.body().text()).toURL();
            String query = parsedUrl.getQuery();
            Map<String, String> queryParams = parse(query);
            if (args.size() == 1) {
                for (Map.Entry<String, String> map : queryParams.entrySet()) {
                    if (args.getFirst().equals(map.getKey())) {
                        return JSONStringer.valueToString(map.getValue());
                    }
                }
                return element.attr(args.getFirst());
            } else if (args.isEmpty()) {
                for (Map.Entry<String, String> map : queryParams.entrySet()) {
                    jsonObject.put(map.getKey(), map.getValue());
                }
                return jsonObject;
            } else {
                for (String arg : args) {
                    for (Map.Entry<String, String> y : queryParams.entrySet()) {
                        if (arg.equals(y.getKey())) {
                            jsonObject.put(y.getKey(), y.getValue());
                        }
                    }
                }
                return jsonObject;
            }
        } catch (UnsupportedEncodingException | MalformedURLException | URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }
    private static Map<String, String> parse(String query) throws UnsupportedEncodingException {
        Map<String, String> params = new HashMap<>();
        if (query != null && !query.isEmpty()) {
            String[] pairs = query.split("&");

            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    // Decode the key and value
                    String key = URLDecoder.decode(keyValue[0], StandardCharsets.UTF_8);
                    String value = URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8);
                    params.put(key, value);
                }
            }
        }
        return params;
    }
}
