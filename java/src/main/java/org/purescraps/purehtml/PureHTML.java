package org.purescraps.purehtml;

import org.purescraps.purehtml.backend.JsoupBackend;
import org.purescraps.purehtml.backend.PureHTMLDocument;
import org.purescraps.purehtml.configs.Config;
import org.purescraps.purehtml.interfaces.ExtractParams;

import java.util.ArrayList;

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
