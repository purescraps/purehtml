import org.json.JSONObject;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.UnsupportedEncodingException;
import java.net.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@SuppressWarnings (value="unchecked")
public class Transformer {
    private static Object trim(String input)
    {
        if (input != null){
            return input.trim();
        }
        return null;
    }

    private static Object number(String input)
    {
        if (input != null)
        {
            return Float.parseFloat(input);
        }
        return null;
    }

    private static Object exists(String input)
    {
        if (input != null)
        {
            return true;
        }
        else
            return false;
    }

    private static Object html(Element element)
    {
        return element.html();
    }

    private static Object length(Element element)
    {
        return element.text().length();
    }

    private static Object resolve()
    {

        return null;
    }

    private static Object urlQueryParam(Document doc, String item, Element element )
    {
        Object output = null;
        JSONObject jsonObject = new JSONObject();
        try
        {
            URL parsedUrl = new URI(doc.body().text()).toURL();
            String query = parsedUrl.getQuery();
            Map<String, String> queryParams = ParseHtmlQuery.parse(query);

            item = item.replace("urlQueryParam","");
            if(item.contains(",")) // more than one, split ","
            {
                item = item.replace("(","");
                item = item.replace(")","");
                //System.out.println("more than 1 attr");
                String[] parts = item.split(",");

                for(String x : parts)
                {
                    x = x.trim();
                    //System.out.println(x);
                    for (Map.Entry<String, String> y : queryParams.entrySet())
                    {
                        if(x.replaceAll("[()]", "").equals(y.getKey()))
                        {
                            jsonObject.put(y.getKey(),y.getValue());
                        }
                    }
                }
                return jsonObject;
            }
            else if (item.contains("()") || item.isEmpty())
            {
                for (Map.Entry<String, String> x : queryParams.entrySet())
                {
                    jsonObject.put(x.getKey(),x.getValue());
                }
                return jsonObject;
                //## Extract all ##\\
            }
            else {
                //## Single Query parameter##\\
                for (Map.Entry<String, String> x : queryParams.entrySet())
                {
                    if(item.replaceAll("[()]", "").equals(x.getKey()))
                    {
                        return x.getValue();
                    }
                }
                output = element.attr(item.replaceAll("[()]", ""));
            }
        }
        catch (URISyntaxException | MalformedURLException e)
        {
            System.out.println(e.getMessage());
        }
        catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
        return output;
    }

    private static Object attr(String item, Element element)
    {
        Object output;
        JSONObject jsonObject = new JSONObject();
        //## Remove attr from string ##//
        item = item.replace("attr","");
        if(item.contains(",")) // more than one, split ","
        {
            String[] parts = item.split(",");
            for(String x : parts)
            {
                x = x.replaceAll("[()]", "");
                x = x.trim();
                jsonObject.put(x, element.attr(x));
            }
            return jsonObject;
        }
        else if (item.contains("()") || item.isEmpty())
        {
            for (Attribute x : element.attributes())
                jsonObject.put(x.getKey(),x.getValue());
            return jsonObject;
        }
        else {
            output = element.attr(item.replaceAll("[()]", ""));
        }
        return output;
    }

    public static Object applyTransformers(String input, Document doc, Element element, Object transformers)
    {

        if (transformers == null)
        {
            System.out.println("null");
            return input;
        }
        Object output = null;
        List<String> transformerArray = new ArrayList<>();
        //## Transformers can be a String or List. ##\\
        if (transformers instanceof String) {
            transformerArray.add((String) transformers);
        }
        else {
            transformerArray.addAll((Collection<? extends String>) transformers);
        }
        //## Loop for applying transformers ##\\
        for (String item: transformerArray)
        {
            if (item.contains("trim"))
            {
                output =  trim(input);
            }
            else if(item.contains("number"))
            {
                output = number(input);
            }
            else if(item.contains("exists"))
            {
                output = exists(input);
            }
            else if(item.contains("html"))
            {
                output = html(element);
            }
            else if(item.contains("length"))
                output = length(element);
            else if(item.contains("resolve"))
                output = resolve();
            else if(item.contains("urlQueryParam"))
            {
                output = urlQueryParam(doc,item,element);
            }
            else if(item.contains("attr"))
            {
                output = attr(item, element);
                input = output.toString();
            }
        }
        return output;
    }
}

