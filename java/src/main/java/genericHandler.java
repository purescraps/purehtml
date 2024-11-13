import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class genericHandler {
    public static List<Object> apply(String html, ConfigSchema configs) throws IOException {
        String selector = configs.getSelector();
        String type = configs.getType();
        Object constant = configs.getConstant();
        List<ConfigSchema> union = configs.getUnion();
        Map<String, ConfigSchema> properties = configs.getProperties();
        if(type == null)
        {
            type= "object";
        }
        String operation = "w";
        List<Object> jsonList = new ArrayList<>();
        Object transform = configs.getTransform();
        ConfigSchema items = configs.getItems();
        //## if there is a constant, return its value.
        if (constant !=null )
        {
            constantHandler.apply(constant);
        }
        else if (union != null)
        {
            unionHandler.apply(html, configs);
            System.exit(6);
        }
        else if (properties != null)
        {
            propertiesHandler.apply(html, properties, selector);
            System.exit(5);
        }
        else {
            File input = new File(html);
            Document doc = Jsoup.parse(input, "UTF-8", "http://example.com/");
            Elements ans = doc.select(selector);
            if (ans.isEmpty())
            {
                if(transform.equals("exists"))
                    writeJSON.write(false,"w");
                else {
                    writeJSON.write(ans, "w");
                }
                System.exit(3);
            }
            Object outputObject;
            for(Element element: ans)
            {
                if(transform == null)
                {
                    if (items != null)
                    {
                        outputObject = itemsHandler.apply(items, element, doc);
                        //outputObject = transformerHandler.applyTransformers(element.text(), element, transform);
                    }
                    else {
                        outputObject = transformerHandler.applyTransformers(element.text(), doc, element, null);
                        //outputObject = itemsHandler.apply(items, element);
                    }
                }
                else {
                    outputObject = transformerHandler.applyTransformers(element.text(), doc, element, transform);
                }

                jsonList.add(outputObject);
            }
            if (type.contains("array"))
                writeJSON.write(jsonList,operation);
            else {
                //writeJSON.write(test,operation);
                for (Object obj: jsonList)
                {
                    writeJSON.write(obj,operation);
                    operation = "a";
                }
            }
        }
        return jsonList;
    }

}
