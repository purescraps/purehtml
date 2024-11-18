import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Items {
    public static List<Object> apply(String htmlFile, String htmlString, ConfigSchema config) throws IOException {
        //when there is items, it will be an array?\\
        List<Object> jsonList = new ArrayList<>();
        int counter = 0;
        ConfigSchema items = config.getItems();
        String selector = config.getSelector();
        String [] selectors = selector.split(",");
        File input;
        // for union below //
        List <ConfigSchema> x = items.getUnion();
        Document doc;
        if(htmlString != null)
        {
            doc = Jsoup.parse(htmlString);
        }
        else  {
            input = new File(htmlFile);
            doc = Jsoup.parse(input, "UTF-8", "http://example.com/");
        }
        if (x!=null)
        {
            for (String currentSelector : selectors)
            {
                Elements ans = doc.select(currentSelector.trim());
                for (Element element : ans)
                {
                    jsonList.add(Extractor.apply(htmlFile, htmlString, x.get(counter)).getLast());
                }
                counter++;
            }
        }
        else {
            Object transform = items.getTransform();
            Elements ans = doc.select(config.getSelector().trim());
            for (Element element : ans)
            {
                if (transform == null) {
                    jsonList.add(element.text());
                } else {
                    jsonList.add(Transformer.applyTransformers(element.text(), doc, element, transform).toString());
                }
            }
        }
        return jsonList;

    }
}