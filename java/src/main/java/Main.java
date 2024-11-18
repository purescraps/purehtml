import java.io.*;
import java.util.List;
@SuppressWarnings("unused")
public class Main {
    public static void main(String[] args) throws IOException {

        // Step 1: Load the YAML file
        String operation = "w";
        List<Object> jsonList;
        String configPath = "java/src/main/resources/config-file.yaml";
        String schemaPath = "java/src/main/resources/config-schema.json";

        //## JSON to Object Serialization ##\\
        ConfigSchema config = Validator.validate(configPath, schemaPath);

        //jsonList is the output of parsing, will be sent to writeJSON
        //depending on the type( array or object)
        jsonList = Extractor.apply("java/src/main/resources/testhtml.html", null, config);

        // Setting type according to properties or items //
        String type = config.getType();
        if (type == null) {
            type = "object";
        }
        if (config.getItems() != null)
            type = "array";

        if (config.getProperties() != null)
            type = "object";
        //****//

        System.out.println("Output:");
        if (type.contains("array")) {
            writeJson.write(jsonList, operation);
        } else {
            for (Object obj : jsonList) {
                writeJson.write(obj, operation);
                operation = "a";
            }
        }
    }
}
