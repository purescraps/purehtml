package com.purescraps.purehtml;

import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.interfaces.ExtractParams;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.yaml.snakeyaml.Yaml;

import java.util.Map;

public class PureHTML {
    public static void extract(Config config, String html, String yaml) {
        Validator.validate(html);
        Document doc = Jsoup.parse(html);
        Yaml parser = new Yaml();
        Map<String, Object> plain = parser.load(yaml);
        Object selector = plain.get("selector");
        Elements elements = null;
        if(selector!= null)
        {
            elements = doc.select((String) selector);
        }
        Elements finalElements = elements;
        ExtractParams extractParams = new ExtractParams() {
            @Override
            public Document document() {
                return doc;
            }
            @Override
            public Elements node() {
                return finalElements;
            }
            @Override
            public String url() {
                return html;
            }
            @Override
            public boolean getElementAlreadyMatched() {
                return false;
            }
            @Override
            public Element element() {
                return null;
            }
        };
        System.out.println(config.extract(extractParams));

    }
}
