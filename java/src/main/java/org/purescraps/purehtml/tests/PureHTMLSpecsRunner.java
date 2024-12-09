package org.purescraps.purehtml.tests;

import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.purescraps.purehtml.configs.Config;
import org.purescraps.purehtml.configs.ConfigFactory;
import org.yaml.snakeyaml.Yaml;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.purescraps.purehtml.PureHTML.extract;

public class PureHTMLSpecsRunner {

    public static void main(String[] args) {
        Path repoRoot = Paths.get(System.getProperty("user.dir"));
        Path specsDir = repoRoot.resolve("../specs");

        try (Stream<Path> paths = Files.walk(specsDir)) {
            paths.filter(Files::isRegularFile)
                    .forEach(filePath -> processFile(specsDir, filePath));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void processFile(Path baseDir, Path filePath) {
        String relativePath = baseDir.relativize(filePath).toString();
        System.out.println("\nProcessing: " + relativePath);

        if (!validateFile(filePath)) {
            System.out.println("Invalid test spec. Skipping " + relativePath);
            return;
        }

        try {
            String content = Files.readString(filePath);
            Yaml yaml = new Yaml();
            Map<String, Object> yamlMap = yaml.load(content);
            List<Map<String, Object>> specs = (List<Map<String, Object>>) yamlMap.get("specs");

            processSpecs(specs, relativePath);
            System.out.println("Done: " + relativePath);

        } catch (IOException e) {
            System.out.println("Error processing file: " + relativePath + " - " + e.getMessage());
        }
    }

    public static boolean validateFile(Path yamlFilePath) {
        Path schemaPath = Paths.get("../spec.schema.yaml");

        try {
            Yaml yaml = new Yaml();
            Map<String, Object> schemaMap = yaml.load(Files.newInputStream(schemaPath));

            // Convert the loaded YAML schema to a JSONObject
            JSONObject schemaJson = new JSONObject(schemaMap);

            // Load the YAML content to be validated
            Map<String, Object> yamlContent = yaml.load(Files.newInputStream(yamlFilePath));

            // Load and validate against the schema
            Schema schema = SchemaLoader.load(schemaJson);
            schema.validate(new JSONObject(yamlContent));
            return true;
        } catch (IOException | ValidationException e) {
            System.out.println("Validation Error: " + e.getMessage());
            return false;
        }
    }

    public static void processSpecs(List<Map<String, Object>> specs, String filePath) {
        for (Map<String, Object> spec : specs) {
            String html = (String) spec.get("input");

            Map<String, Object> configuration = (Map<String, Object>) spec.get("configuration");
            // Create the Config object from configuration (similar to Python's
            // `ConfigFactory.from_yaml`)
            Config config = ConfigFactory.fromYAML(configuration);

            // Extract the answer using PureHTML
            Object answer = extract(config, html, "http://example.com");

            Object expected = spec.get("expected");
            String answer_string;
            if (answer == null)
                answer_string = "null";
            else if (answer.equals("[]"))
                answer_string = "null";
            else
                answer_string = answer.toString();
            compareValues(answer_string, expected, filePath, spec);
        }
    }

    public static void compareValues(String answer, Object expected, String filePath, Map<String, Object> spec) {
        if (answer.equals(expected.toString())) {
            System.out.println("  ✔️ " + spec.get("description"));
        } else {
            System.out.println("  ❌ " + spec.get("description"));
            reportIncorrectValues(answer, expected);
        }
    }

    public static void reportIncorrectValues(String answer, Object expected) {
        System.out.println("    Extracted: " + answer);
        System.out.println("    Expected : " + expected);
        System.out.println("Extracted value did not match the expected");
    }
}
