import org.json.JSONObject;
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
    private final ConfigSchema config;
    private Document doc;
    String selector;
    Object constant;
    List<ConfigSchema> unions;
    Object transform;
    ConfigSchema items;
    Map<String, ConfigSchema> properties;
    private List<Object> jsonList = new ArrayList<>(); // this will hold all outputs from given config, we will return it to main in the end.

    public Extractor(String htmlFile, String htmlString, ConfigSchema config)
    {
        this.config = config;
        this.doc = null;
        this.selector = config.getSelector();
        this.constant = config.getConstant();
        this.unions = config.getUnion();
        this.transform = config.getTransform();
        this.items = config.getItems();
        this.properties = config.getProperties();
        if(htmlString != null)
        {
            this.doc = Jsoup.parse(htmlString);
        }
        else  {
            File input = new File(htmlFile);
            try{
                this.doc = Jsoup.parse(input, "UTF-8", "http://example.com/");
            }
            catch (IOException e)
            {
                System.out.println(e.getMessage());
            }
        }
    }

    public List<Object> getJson()
    {
        return this.jsonList;
    }

    private void items(){
        int counter = 0;
        String [] selectors = selector.split(",");
        // for union below //
        if (items.getUnion()!=null)
        {
            unions = new ArrayList<>();
            for (String _ : selectors)
            {
                unions.add(items.getUnion().get(counter));
                constant = items.getUnion().get(counter).getConstant();
                transform = items.getUnion().get(counter).getTransform();
                //Elements elements = doc.select(currentSelector.trim());
                apply();
                unions.removeFirst();
                counter++;
            }
        }
        else {
            transform = items.getTransform();
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
    }
    private void properties(){
        ConfigSchema schema;
        Object outputObject;
        JSONObject jsonObject = new JSONObject();
        for (Map.Entry<String, ConfigSchema> property : properties.entrySet())
        {
            schema = property.getValue();
            transform = schema.getTransform();
            //  # if no other selector was provided, transformers will be executed
            //  # on the parent element
            if (schema.getSelector() != null)
            {
                selector = schema.getSelector();
            }
            Elements ans = doc.select(selector);
            for ( Element element: ans)
            {
                outputObject = Transformer.applyTransformers(element.text(), doc, element, transform);
                jsonObject.put(property.getKey(), outputObject);
            }
        }
        jsonList.add(jsonObject);
    }
    private void union() {
        Elements elements;
        int counter = 1;
        for (ConfigSchema union: unions)
        {
            //For the last iteration, we will check if selector returns any element if not, then we output constant
            if(unions.size() == counter)
            {
                //iterate last union object
                if(union.getSelector() != null)
                {
                    elements = doc.select(union.getSelector());
                    if(!elements.isEmpty()) //if there is an element, apply given transforms if any.
                    {
                        //System.out.println("Elements");
                        for(Element element: elements) // loop for elements
                        {
                            jsonList.add(Transformer.applyTransformers(element.text(), doc, element, union.getTransform()));
                        }
                    }
                    else { // if there is no element and since this is the last iteration, we will output the constant.
                        jsonList.add(union.getConstant());
                    }
                }
                else if(union.getConstant() != null) // if no selector is given, then output the constant.
                {
                    jsonList.add(union.getConstant());

                }
                else // if no constant, then output null.
                    jsonList = null;
                return;
            }
            //if it is not the last object, then we will check the elements and add it to jsonList. after last iteration
            //we will return jsonList.
            elements = doc.select(union.getSelector());
            if(elements.isEmpty())   // if no element is found, and it is not the last iteration, continue with next union object.
            {
                counter++;
            }
            else {  // apply the given transformers and add results to jsonList.
                for(Element element: elements)
                {
                    jsonList.add(Transformer.applyTransformers(element.text(), doc, element, union.getTransform()));
                }
            }

        }
    }
    public void apply(){
        //#for test#//
        Object outputObject;
        //## if there is a constant, return its value.
        if (constant !=null )   // if there is a constant, just add it to jsonList.
        {
            jsonList.add(constant.toString());
        }
        // if there is a union, parse it and output the results.
        else if (unions != null)
        {
            union();
        }
        // if there is a properties, parse it and output the results. type will be checked in main.
        else if (properties != null)
        {
            properties();
        }
        // if there is items, parse it and output the results. type will be checked in main.
        else if (items!= null)
        {
            items();
        }
        //if there is just either selector or transformer, then apply them directly.
        else {
            Elements elements = doc.select(selector);
            if (elements.isEmpty()) // if no element found with given selector, then return null.
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
                for(Element element: elements)
                {
                    outputObject = Transformer.applyTransformers(element.text(), doc, element, transform);
                    jsonList.add(outputObject);
                }
            }
        }

    }
}