package com.purescraps.purehtml.tests;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.purescraps.purehtml.PureHTML;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.configs.ConfigFactory;
import org.everit.json.schema.Schema;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.json.JSONStringer;
import org.yaml.snakeyaml.Yaml;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

public class Specs {

    public static void main(String[] args) {
        // Directories
        Path startPath = Paths.get("specs");
        try (Stream<Path> filePathStream = Files.walk(startPath)) {
            filePathStream.filter(Files::isRegularFile) // Filter out directories, leaving only files
                    .forEach(path -> {
                        // Read the file content
                        try {
                            //If validation Success, continue
                            if (validate(path.toString())) {
                                String content = Files.readString(path);
                                ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
                                Map<String, Object> yamlMap = yamlMapper.readValue(content, new TypeReference<>() {
                                });
                                @SuppressWarnings("unchecked")
                                List<Map<String, Object>> specs = (List<Map<String, Object>>) yamlMap.get("specs");

                                for (Map<String, Object> spec : specs) {
                                    String html = spec.get("input") != null ? spec.get("input").toString() : "";
                                    @SuppressWarnings("unchecked")
                                    Map<String, Object> configuration = (Map<String, Object>) spec.get("configuration");
                                    Config config = ConfigFactory.fromYAML(configuration);
                                    Object answer = PureHTML.extract(config, html, configuration);
                                    @SuppressWarnings("unchecked")
                                    List<String> expected = (List<String>) spec.get("expected");
                                    ObjectMapper objectMapper = new ObjectMapper();
                                    Object outputObject = objectMapper.readValue(answer.toString(), Object.class);
                                    Object expectedObject = objectMapper.readValue(JSONStringer.valueToString(expected), Object.class);
                                    if (!outputObject.equals(expectedObject)) {
                                        System.out.println("File: " + path);
                                        System.out.println("Description: " + spec.get("description"));
                                        System.out.println("Extracted Values: " + outputObject);
                                        System.out.println("Expected Values : " + expectedObject);
                                    } else {

                                        //comment below to not see successful ones.
                                        System.out.println("Success: " + path );
                                    }
                                }
                            }
                        } catch (IOException e) {
                            System.err.println("Error reading file: " + path + " - " + e.getMessage());
                        }
                    });
        } catch (IOException e) {
            System.err.println("Error walking file tree: " + e.getMessage());
        }
    }

    private static boolean validate(String yamlFilePath){
        //Below is the schema path from the repository folder, which is just file name itself.
        String schemaPath = "spec.schema.yaml";
        // Load the YAML schema and yamlFile into a Java object and validate
        try{
            Yaml yaml = new Yaml();
            FileInputStream yamlInputStream = new FileInputStream(schemaPath);
            Object schemaObject = yaml.load(yamlInputStream);

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonSchema = objectMapper.writeValueAsString(schemaObject);

            yaml = new Yaml();
            FileInputStream yamlInputStream2 = new FileInputStream(yamlFilePath);
            Object yamlObject = yaml.load(yamlInputStream2);

            objectMapper = new ObjectMapper();
            String jsonContent = objectMapper.writeValueAsString(yamlObject);

            JSONObject jsonSchemaObject = new JSONObject(jsonSchema);
            Schema schema = SchemaLoader.load(jsonSchemaObject);

            JSONObject jsonObject = new JSONObject(jsonContent);
            schema.validate(jsonObject);  // This will throw an exception if the validation fails
            return true;
        }
        catch(FileNotFoundException e){
            System.out.println(e.getMessage());
            return false;

        } catch (JsonProcessingException e) {
            System.out.println("File: " +yamlFilePath + ": " + e.getMessage() );
            return false;
        }

    }

}
