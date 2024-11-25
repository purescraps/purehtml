package com.purescraps.purehtml.configs.types;
import com.purescraps.purehtml.ExtractParamsBuilder;
import com.purescraps.purehtml.interfaces.ExtractParams;
import com.purescraps.purehtml.interfaces.GetSelectorMatchesParams;
import com.purescraps.purehtml.configs.Config;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class UnionConfig extends Config {
    private final List<Config> configs;

    //constructor
    public UnionConfig(List<Config> configs) {
        super();
        this.configs = configs;
    }
    // The extract method
    public Object extract(ExtractParams params) {

        Elements parentElement = params.node();
        List<Object> result = new ArrayList<>();
        int configIndex = 0;
        int elementIndex = 0;
        for (Config config : configs) {
            if (config instanceof ConfigWithSelector configWithSelector) {
                GetSelectorMatchesParams param = new GetSelectorMatchesParams() {
                    @Override
                    public boolean isAlreadyMatched() {
                        return false;
                    }

                    @Override
                    public boolean isIncludeRoot() {
                        return true;
                    }

                    @Override
                    public Document doc() {
                        return params.document();
                    }
                };
                Element element=null;
                //element = (Element) configWithSelector.getAtIndex(parentElement, param, index);
                Elements elements =(Elements)  configWithSelector.getAllMatches(parentElement, param);
                if (elements == null) {
                    if(configIndex != configs.size() - 1)
                    {
                        configIndex++;
                        continue;
                    }
                }
                else{
                    element = elements.get(elementIndex);
                    elementIndex++;
                }
                ExtractParams extractParams = new ExtractParamsBuilder()
                        .setDocument(params.document())
                        .setNode(params.node())
                        .setUrl(params.url())
                        .setElementAlreadyMatched(true)
                        .setElement(element)
                        .build();
                result.add(config.extract(extractParams));
            }
            else {
                ExtractParams extractParams = new ExtractParamsBuilder()
                        .setDocument(params.document())
                        .setNode(params.node())
                        .setUrl(params.url())
                        .setElementAlreadyMatched(params.getElementAlreadyMatched())
                        .setElement(params.element())
                        .build();
                result.add(config.extract(extractParams));
            }

        }
        // Convert each object to its string representation
        // Join with a separator
        return result.stream()
                .map(String::valueOf) // Convert each object to its string representation
                .collect(Collectors.joining(", "));

    }

}
