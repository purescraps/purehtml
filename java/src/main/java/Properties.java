import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.IOException;
import java.util.Map;

public class Properties {
    public static Object apply(String htmlFile, String htmlString,  Map<String, ConfigSchema> properties, String selector) throws IOException {

        File input;
        Document doc;
        if(htmlString != null)
        {
            doc = Jsoup.parse(htmlString);
        }
        else {
            input = new File(htmlFile);
            doc = Jsoup.parse(input, "UTF-8", "http://example.com/");
        }

        ConfigSchema test1;
        Object outputObject;
        JSONObject jsonObject = new JSONObject();

        for (Map.Entry<String, ConfigSchema> x : properties.entrySet())
        {

            test1 = x.getValue();
            Object transform = test1.getTransform();
            //  # if no other selector was provided, transformers will be executed
            //  # on the parent element
            if (test1.getSelector() != null)
            {
                selector = test1.getSelector();
            }
            Elements ans = doc.select(selector);
            for ( Element elem: ans)
            {
                outputObject = Transformer.applyTransformers(elem.text(), doc, elem, transform);
                jsonObject.put(x.getKey(), outputObject);
            }
        }

        return jsonObject;
    }
}
