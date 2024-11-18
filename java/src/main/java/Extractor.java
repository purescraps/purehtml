import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Extractor {
    public static List<Object> apply(String htmlFile, String htmlString, ConfigSchema configs) throws IOException {
        //#for test#//
        Document doc;
        File input;
        if(htmlString != null)
        {
            doc = Jsoup.parse(htmlString);
        }
        else  {
            input = new File(htmlFile);
            doc = Jsoup.parse(input, "UTF-8", "http://example.com/");
        }

        String selector = configs.getSelector();
        Object constant = configs.getConstant();
        List<ConfigSchema> union = configs.getUnion();
        Object transform = configs.getTransform();
        ConfigSchema items = configs.getItems();
        Map<String, ConfigSchema> properties = configs.getProperties();
        Object outputObject;
        List<Object> jsonList = new ArrayList<>(); // this will hold all outputs from given config, we will return it to main in the end.

        //## if there is a constant, return its value.
        if (constant !=null )   // if there is a constant, just add it to jsonList.
        {
            jsonList.add(constant.toString());
        }
        // if there is a union, parse it and output the results.
        else if (union != null)
        {
            jsonList = (Union.apply(htmlFile, htmlString, configs));
        }
        // if there is a properties, parse it and output the results. type will be checked in main.
        else if (properties != null)
        {
            jsonList.add(Properties.apply(htmlFile, htmlString, properties, selector));
        }
        // if there is items, parse it and output the results. type will be checked in main.
        else if (items!= null)
        {
            jsonList = (Items.apply(htmlFile,htmlString, configs));
        }
        //if there is just either selector or transformer, then apply them directly.
        else {
            Elements ans = doc.select(selector);
            if (ans.isEmpty()) // if no element found with given selector, then return null.
            {
                // we check if "exists" transform is given, if it is then we will output false instead of null.
                if (transform == null)
                {
                    jsonList.add(null);
                }
                else if(transform.equals("exists"))
                {
                    jsonList.add(false);
                }
            }
            // if there is any element, then iterate each and apply transformers.
            else {
                for(Element element: ans)
                {
                    outputObject = Transformer.applyTransformers(element.text(), doc, element, transform);
                    jsonList.add(outputObject);
                }
            }
        }
        return jsonList;
    }

}