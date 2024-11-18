import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Union {
    public static List<Object> apply(String htmlFile, String htmlString, ConfigSchema config) throws IOException {
        List<Object> jsonList = new ArrayList<>();
        List<ConfigSchema> unions = config.getUnion();
        Document doc;
        Elements ans;
        File input;
        int counter = 1;
        if(htmlString != null)
        {
            doc = Jsoup.parse(htmlString);
        }
        else {
            input = new File(htmlFile);
            doc = Jsoup.parse(input, "UTF-8", "http://example.com/");
        }
        for (ConfigSchema union: unions)
        {
            //For the last iteration, we will check if selector returns any element if not, then we output constant
            if(unions.size() == counter)
            {
                //iterate last union object
                if(union.getSelector() != null)
                {
                    ans = doc.select(union.getSelector());

                    if(!ans.isEmpty()) //if there is an element, apply given transforms if any.
                    {
                        for(Element element: ans) // loop for elements
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
                    return jsonList;
                }
                else // if no constant, then output null.
                    return null;
            }
            //if it is not the last object, then we will check the elements and add it to jsonList. after last iteration
            //we will return jsonList.
            ans = doc.select(union.getSelector());
            if(ans.isEmpty())   // if no element is found, and it is not the last iteration, continue with next union object.
            {
                counter++;
            }
            else {  // apply the given transformers and add results to jsonList.
                for(Element element: ans)
                {
                    jsonList.add(Transformer.applyTransformers(element.text(), doc, element, union.getTransform()));
                }
            }

        }
        // return all the outputs as List.
        return jsonList;
    }

}
