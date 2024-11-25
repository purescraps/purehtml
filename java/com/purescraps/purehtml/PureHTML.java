package com.purescraps.purehtml;

import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.interfaces.ExtractParams;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.yaml.snakeyaml.Yaml;

import java.util.Map;

public class PureHTML {

    public static Object extract(Config config, String html, Map<String, Object> plain)
    {
        //This one is for Already created Map from yaml, Map<String, Object> plain. Will be used for Specs.
        Document doc = Jsoup.parse(html);
        Object selector = plain.get("selector");
        Elements elements = null;
        if(selector!= null)
        {
            elements = doc.select((String) selector);
        }

        ExtractParams extractParams = new ExtractParamsBuilder()
                .setDocument(doc)
                .setNode(elements)
                .setUrl(html)
                .setElementAlreadyMatched(false)
                .setElement(null)
                .build();

        return config.extract(extractParams);

    }

    public static Object extract(Config config, String html, String yaml) {
        //This one is for String version of yaml.
        Validator.validate(yaml);
        Document doc = Jsoup.parse(html);
        Yaml parser = new Yaml();
        Map<String, Object> plain = parser.load(yaml);
        Object selector = plain.get("selector");
        Elements elements = null;
        if(selector!= null)
        {
            elements = doc.select((String) selector);
        }

        ExtractParams extractParams = new ExtractParamsBuilder()
                .setDocument(doc)
                .setNode(elements)
                .setUrl(html)
                .setElementAlreadyMatched(false)
                .setElement(null)
                .build();

        return config.extract(extractParams);
    }
}
