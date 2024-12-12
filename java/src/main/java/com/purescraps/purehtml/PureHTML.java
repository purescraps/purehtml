package com.purescraps.purehtml;

import java.util.ArrayList;

import com.purescraps.purehtml.backend.JsoupBackend;
import com.purescraps.purehtml.backend.PureHTMLDocument;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.interfaces.ExtractParams;

public class PureHTML {

    public static Object extract(Config config, String html, String url) {

        PureHTMLDocument doc = JsoupBackend.load(html);
        ExtractParams extractParams = new ExtractParamsBuilder()
                .setDocument(doc)
                .setNode(new ArrayList<>())
                .setUrl(url)
                .setElementAlreadyMatched(false)
                .build();

        return config.extract(extractParams);

    }

}
