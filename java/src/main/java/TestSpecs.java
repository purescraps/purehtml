import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONStringer;
import org.yaml.snakeyaml.Yaml;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.everit.json.schema.*;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

public class TestSpecs {
    public static void main(String[] args) throws IOException {

        //---> Add directory check for all yaml files//

        System.out.println("This is for testing files in specs folder. Starting test.. ");

        String yamlFilePath = "java/src/main/resources/specfile.yaml";

        // Load the YAML schema into a Java object
        Yaml yaml = new Yaml();
        FileInputStream yamlInputStream = new FileInputStream(yamlFilePath);
        Object schemaObject = yaml.load(yamlInputStream);

        // Convert the Java object to a JSON schema using Jackson
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonSchema = objectMapper.writeValueAsString(schemaObject);

        yaml = new Yaml();
        FileInputStream yamlInputStream2 = new FileInputStream("specs/transformers/attr.yaml");
        Object yamlObject = yaml.load(yamlInputStream2);

        objectMapper = new ObjectMapper();
        String jsonContent = objectMapper.writeValueAsString(yamlObject);


        // Step 3: Parse the JSON Schema string into a JSONObject
        JSONObject jsonSchemaObject = new JSONObject(jsonSchema);

        // Step 4: Load the JSON Schema using JSON Schema validator
        Schema schema = SchemaLoader.load(jsonSchemaObject);
        List<Object> jsonList;
        Extractor extractor;
        try {
            JSONObject jsonObject = new JSONObject(jsonContent);
            schema.validate(jsonObject);  // This will throw an exception if the validation fails
            System.out.println("YAML is valid according to the schema.");
            SpecConfig spec = YamlSpecParser.parse();
            //"Spec is a must value"\\
            if (spec == null)
            {
                System.out.println("Specs is null, check configuration.");
                System.exit(-1);
            }
            for(Spec spc :spec.getSpecs())
            {
                ObjectMapper mapper = new ObjectMapper();
                ConfigSchema m = mapper.readValue(JSONStringer.valueToString(spc.getConfiguration()),ConfigSchema.class);
                extractor = new Extractor(null, spc.getInput(), m);
                extractor.apply();
                jsonList = extractor.getJson();
                if(jsonList.equals(spc.getExpected()))
                {
                    System.out.println("Test succeeded.");
                    System.out.println("Output  : " + jsonList);
                    System.out.println("Expected: " + spc.getExpected());
                }
                else {
                    System.out.println("Test failed.");
                    System.out.println("Output : "+jsonList);
                    System.out.println("Expected :"+spc.getExpected());
                }
            }
        } catch (ValidationException e) {
            System.out.println("YAML is invalid. Validation errors:");
            e.getAllMessages().forEach(System.out::println);
        }

    }
}