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
public class transformerHandler {

    public static Object applyTransformers(String input, Document doc, Element element, Object transformers)
    {
        if (transformers == null)
        {
            return input;
        }
        Object output = null;
        JSONObject jsonObject = new JSONObject();
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

                if (input != null){
                    input =input.trim();
                    output=input;
                    //writeJSON.write(output);
                }
            }

            else if(item.contains("number"))
            {

                if (input != null)
                {
                    //System.out.println("input is this" );
                    output = Float.parseFloat(input);
                }

            }
            else if(item.contains("exists"))
            {

                if (input != null)
                {
                    output = true;
                }
                else
                    output = false;

            }

            else if(item.contains("html\0"))
                output = element.html();

            else if(item.contains("length"))
                output = element.text().length();

            else if(item.contains("resolve"))
                //output = element.attr(attr);
                break;
            else if(item.contains("urlQueryParam"))
            {
                try
                {
                    URL parsedUrl = new URI(doc.body().text()).toURL();

                    String query = parsedUrl.getQuery();
                    Map<String, String> queryParams = parseQueryString.parse(query);

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
                            System.out.println(x);
                            for (Map.Entry<String, String> y : queryParams.entrySet())
                            {
                                if(x.replaceAll("[()]", "").equals(y.getKey()))
                                {
                                    jsonObject.put(y.getKey(),y.getValue());
                                }
                            }
                        }
                        return jsonObject;
                        //writeJSON.write(jsonObject);
                    }
                    else if (item.contains("()") || item.isEmpty())
                    {
                        for (Map.Entry<String, String> x : queryParams.entrySet())
                        {
                            jsonObject.put(x.getKey(),x.getValue());
                        }
                        return jsonObject;
                        //## Extract all ##\\
                        //System.out.println("attr() or attr");
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

            }

            else if(item.contains("attr"))
            {
                //System.out.println("transform -> Attr");

                //## Remove attr from string ##//
                item = item.replace("attr","");
                if(item.contains(",")) // more than one, split ","
                {
                    //System.out.println("more than 1 attr");
                    String[] parts = item.split(",");

                    for(String x : parts)
                    {
                        x = x.replaceAll("[()]", "");
                        x = x.trim();
                        jsonObject.put(x, element.attr(x));
                    }
                    return jsonObject;
                    //writeJSON.write(jsonObject);
                }
                else if (item.contains("()") || item.isEmpty())
                {
                    //System.out.println("attr() or attr");
                    for (Attribute x : element.attributes())
                        jsonObject.put(x.getKey(),x.getValue());
                    return jsonObject;
                }
                else {
                    System.out.println(element.attr(item.replaceAll("[()]", ""))+"Anan");
                    output = element.attr(item.replaceAll("[()]", ""));

                }
                input = output.toString();
                }
            }
        return output;
    }
}
