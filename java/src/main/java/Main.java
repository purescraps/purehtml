import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import com.github.fge.jsonschema.core.exceptions.ProcessingException;
import com.github.fge.jsonschema.main.JsonSchema;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import java.io.*;
import java.net.URI;
import java.util.List;
@SuppressWarnings("unused")
public class Main {
    public static void main(String[] args) {
        try {
            // Step 1: Load the YAML file
            List<Object> jsonList;
            File yamlFile = new File("java/src/main/resources/config-file.yaml");
            YAMLMapper yamlMapper = new YAMLMapper(new YAMLFactory());
            JsonNode yamlJsonNode = yamlMapper.readTree(yamlFile);

            // Step 2: Load the JSON Schema
            File schemaFile = new File("java/src/main/resources/config-schema.json");

            // Ensure the schema file is absolute or use URI
            URI schemaURI = schemaFile.toURI();  // Convert file to URI

            // Load schema from URI (or from file directly, using file API)
            ObjectMapper jsonMapper = new ObjectMapper();
            JsonNode schemaNode = jsonMapper.readTree(schemaFile);

            // Step 3: Initialize JSON Schema validator
            JsonSchemaFactory schemaFactory = JsonSchemaFactory.byDefault();
            JsonSchema schema = schemaFactory.getJsonSchema(schemaURI.toString()); // use URI as string

            // Step 4: Validate YAML (converted to JSON) against the JSON schema
            schema.validate(yamlJsonNode);

            System.out.println("YAML configuration is valid.");
            //## JSON to Object Serialization ##\\
            ConfigSchema config = YamlConfigParser.parse();
            if (config == null)
                System.out.println("config is null, check .yaml config file.");
            else
            {
                jsonList = genericHandler.apply("java/src/main/resources/testhtml.html", config);
                System.out.println(jsonList);
            }


        } catch (IOException e) {
            System.err.println("I/O Exception: " + e.getMessage());
        } catch (ProcessingException e) {
            System.err.println("Validation error: " + e.getMessage());
        }
    }
    }
