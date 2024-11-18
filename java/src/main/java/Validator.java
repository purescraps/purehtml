import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import com.github.fge.jsonschema.core.exceptions.ProcessingException;
import com.github.fge.jsonschema.main.JsonSchema;
import com.github.fge.jsonschema.main.JsonSchemaFactory;

import java.io.File;
import java.io.IOException;
import java.net.URI;

public class Validator {

    static public ConfigSchema validate(String configPath, String schemaPath) {
        try {
            // loading the yaml config.
            File yamlFile = new File(configPath);
            YAMLMapper yamlMapper = new YAMLMapper(new YAMLFactory());
            JsonNode yamlJsonNode = yamlMapper.readTree(yamlFile);

            // Step 2: Loading config-schema.
            File schemaFile = new File(schemaPath);

            // Ensure the schema file is absolute or use URI
            URI schemaURI = schemaFile.toURI();  // Convert file to URI

            // Load schema from URI
            ObjectMapper jsonMapper = new ObjectMapper();
            JsonNode schemaNode = jsonMapper.readTree(schemaFile);

            // Initialize JSON Schema validator
            JsonSchemaFactory schemaFactory = JsonSchemaFactory.byDefault();
            JsonSchema schema = schemaFactory.getJsonSchema(schemaURI.toString()); // use URI as string

            // Validate YAML (converted to JSON) against the JSON schema
            schema.validate(yamlJsonNode);
            System.out.println("YAML configuration is valid.");
        }
        catch (IOException e) {
            System.err.println("I/O Exception: " + e.getMessage());
            System.exit(-1);
        } catch (ProcessingException e) {
            System.err.println("Validation error: " + e.getMessage());
            System.exit(-1);
        }
        // if config is valid, then we will serialize it to ConfigSchema class, and return it to main.
        ConfigSchema config = YamlConfigParser.parse();
        if (config == null) {
            System.out.println("config is null, check .yaml config file.");
            System.exit(-1);
        }
        return config;

    }

}
