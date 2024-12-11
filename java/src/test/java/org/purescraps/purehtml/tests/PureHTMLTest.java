package org.purescraps.purehtml.tests;

import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.purescraps.purehtml.PureHTML.extract;

public class PureHTMLTest {

    private final Path repoRoot = Paths.get(System.getProperty("user.dir"));
    private final Path specsDir = repoRoot.resolve("../specs");

    @Test
    void testAllSpecs() {
        try (Stream<Path> paths = Files.walk(specsDir)) {
            paths.filter(Files::isRegularFile)
                    .forEach(filePath -> {
                        try {
                            processFile(specsDir, filePath);
                        } catch (Exception e) {
                            fail("Error processing file: " + filePath.toString() + " - " + e.getMessage());
                        }
                    });
        } catch (IOException e) {
            fail("Error reading specs directory: " + e.getMessage());
        }
    }

    private void processFile(Path baseDir, Path filePath) {
        String relativePath = baseDir.relativize(filePath).toString();
        System.out.println("\nProcessing: " + relativePath);

        if (!validateFile(filePath)) {
            fail("Invalid test spec. Skipping " + relativePath);
        }

        try {
            String content = Files.readString(filePath);
            Yaml yaml = new Yaml();
            Map<String, Object> yamlMap = yaml.load(content);
            List<Map<String, Object>> specs = (List<Map<String, Object>>) yamlMap.get("specs");

            processSpecs(specs, relativePath);
            System.out.println("Done: " + relativePath);

        } catch (IOException e) {
            fail("Error processing file: " + relativePath + " - " + e.getMessage());
        }
    }

    private boolean validateFile(Path yamlFilePath) {
        Path schemaPath = Paths.get("../spec.schema.yaml");
        try {
            Yaml yaml = new Yaml();
            Map<String, Object> schemaMap = yaml.load(Files.newInputStream(schemaPath));

            JSONObject schemaJson = new JSONObject(schemaMap);
            Map<String, Object> yamlContent = yaml.load(Files.newInputStream(yamlFilePath));

            Schema schema = SchemaLoader.load(schemaJson);
            schema.validate(new JSONObject(yamlContent));
            return true;
        } catch (IOException | ValidationException e) {
            System.out.println("Validation Error: " + e.getMessage());
            return false;
        }
    }

    private void processSpecs(List<Map<String, Object>> specs, String filePath) {
        for (Map<String, Object> spec : specs) {
            String html = (String) spec.get("input");

            Map<String, Object> configuration = (Map<String, Object>) spec.get("configuration");
            Config config = ConfigFactory.fromYAML(configuration);

            Object answer = extract(config, html, "http://example.com");
            Object expected = spec.get("expected");
            String answerString = (answer == null || answer.equals("[]")) ? "null" : answer.toString();

            compareValues(answerString, expected, filePath, spec);
        }
    }

    private void compareValues(String answer, Object expected, String filePath, Map<String, Object> spec) {
        if (answer.equals(expected.toString())) {
            System.out.println(" --Success: " + spec.get("description"));
        } else {
            System.out.println(" --Fail: " + spec.get("description"));
            reportIncorrectValues(answer, expected);
        }
    }

    private void reportIncorrectValues(String answer, Object expected) {
        System.out.println("    Extracted: " + answer);
        System.out.println("    Expected : " + expected);
        System.out.println("Extracted value did not match the expected");
    }
}
