import org.json.JSONStringer;
import java.util.Arrays;
import java.util.List;
@SuppressWarnings("unused")
public class Main {
    public static void main(String[] args){

        // Step 1: Load the YAML file
        String operation = "w";

        List<Object> jsonList;
        String configPath = "java/src/main/resources/config-file.yaml";
        String schemaPath = "java/src/main/resources/config-schema.json";

        //## JSON to Object Serialization ##\\
        ConfigSchema config = Validator.validate(configPath, schemaPath);
        //jsonList is the output of parsing, will be sent to writeJSON
        //depending on the type( array or object)
        Extractor extractor = new Extractor("java/src/main/resources/testhtml.html", null, config);
        extractor.apply();
        jsonList = extractor.getJson();

                // Setting type according to properties or items //
        String type = config.getType();
        if (type == null) {
            type = "object";
        }
        if (config.getItems() != null)
            type = "array";

        if (config.getProperties() != null)
            type = "object";

        if (type.contains("array")) {
            System.out.println(JSONStringer.valueToString(jsonList));
        } else {
            for (Object obj : jsonList) {
                String list = Arrays.toString(jsonList.toArray()).replace("[", "").replace("]", "");
                System.out.println(list);
            }
        }
    }
}
