import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class itemsHandler {
    public static Object apply(ConfigSchema items, Element element, Document doc ) {

        //String selector = items.getItems().getSelector();
        Object transform = items.getTransform();
        Object outputObject;
        if (transform == null) {
            outputObject = element.text();
            writeJSON.write(outputObject, "w");
        } else {
            outputObject = transformerHandler.applyTransformers(element.text(), doc, element, transform);
        }
        return outputObject;
    }
}
