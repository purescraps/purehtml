package com.purescraps.purehtml.tests;

import org.junit.jupiter.api.Test;
import org.yaml.snakeyaml.Yaml;

import com.purescraps.purehtml.Validator;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.configs.ConfigFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import static com.purescraps.purehtml.PureHTML.extract;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Covers the `default: <any value>` config option: when the wrapped config's
 * extraction yields null (selector/union matched nothing), the configured
 * default is returned instead. Falsy-but-real results (0, "", false) must
 * NOT be replaced.
 *
 * Also bypasses PureHTMLTest's Files.walk-based spec harness (see
 * java/src/test/.../PureHTMLTest.java) to directly prove that the new
 * "default" spec cases added to specs/basic.yaml and specs/union.yaml
 * actually execute and pass, since that harness is known to silently stop
 * walking the specs/ directory once it hits a spec file whose
 * `expected: null` case fails SnakeYAML->JSONObject schema validation.
 */
public class DefaultValueConfigTest {

    private static final String HTML = """
            <div>
              <span class="present">hi</span>
              <span class="zero">0</span>
              <span class="empty"></span>
              <span class="falsebox"></span>
            </div>
            """;

    @SuppressWarnings("unchecked")
    private Config configFor(String yaml) {
        Yaml parser = new Yaml();
        Map<String, Object> plain = parser.load(yaml);
        return ConfigFactory.fromYAML(plain);
    }

    @Test
    void defaultKicksInWhenSelectorMatchesNothing() {
        Config config = configFor("selector: .missing\ndefault: fallback-value");
        assertEquals("fallback-value", extract(config, HTML, "http://example.com"));
    }

    @Test
    void defaultIgnoredWhenSelectorMatches() {
        Config config = configFor("selector: .present\ndefault: fallback-value");
        assertEquals("hi", extract(config, HTML, "http://example.com"));
    }

    @Test
    void defaultKicksInWhenUnionMatchesNothing() {
        Config config = configFor("""
                union:
                  - selector: .missing1
                  - selector: .missing2
                default: fallback-union
                """);
        assertEquals("fallback-union", extract(config, HTML, "http://example.com"));
    }

    @Test
    void defaultIgnoredWhenUnionMemberMatches() {
        Config config = configFor("""
                union:
                  - selector: .missing1
                  - selector: .present
                default: fallback-union
                """);
        assertEquals("hi", extract(config, HTML, "http://example.com"));
    }

    @Test
    void falsyZeroIsNotReplacedByDefault() {
        Config config = configFor("selector: .zero\ntype: number\ndefault: -1");
        Object result = extract(config, HTML, "http://example.com");
        assertTrue(result instanceof Number);
        assertEquals(0.0, ((Number) result).doubleValue());
    }

    @Test
    void falsyEmptyStringIsNotReplacedByDefault() {
        Config config = configFor("selector: .empty\ndefault: MISSING");
        assertEquals("", extract(config, HTML, "http://example.com"));
    }

    @Test
    void falsyFalseIsNotReplacedByDefault() {
        Config config = configFor("selector: .falsebox\ntype: boolean\ndefault: true");
        Object result = extract(config, HTML, "http://example.com");
        assertEquals(Boolean.FALSE, result);
    }

    @Test
    void validatorAllowsDefaultOnPrimitiveConfig() {
        assertTrue(Validator.validate("selector: .foo\ndefault: unknown"));
    }

    @Test
    void validatorAllowsDefaultOnObjectConfig() {
        assertTrue(Validator.validate("""
                selector: .foo
                properties:
                  x:
                    selector: .x
                default: {}
                """));
    }

    @Test
    void validatorAllowsDefaultOnArrayConfig() {
        assertTrue(Validator.validate("""
                selector: .foo
                items:
                  selector: .tt
                default: []
                """));
    }

    @Test
    void validatorAllowsDefaultOnUnionConfig() {
        assertTrue(Validator.validate("""
                union:
                  - selector: .foo
                default: unknown
                """));
    }

    @Test
    void validatorAllowsDefaultOnConstantConfig() {
        assertTrue(Validator.validate("""
                selector: .foo
                constant: bar
                default: unknown
                """));
    }

    /**
     * Directly loads specs/basic.yaml and specs/union.yaml (bypassing
     * PureHTMLTest's fragile Files.walk harness) and runs every spec whose
     * description mentions "default", asserting the extracted value matches
     * `expected`. This proves the new contract-test cases genuinely execute
     * and pass, independent of whichever file the walk happens to reach
     * first.
     */
    @Test
    @SuppressWarnings("unchecked")
    void newDefaultSpecCasesActuallyRunAndPass() throws IOException {
        Path specsDir = Paths.get(System.getProperty("user.dir")).resolve("../specs");

        List<Map<String, Object>> basicSpecs = loadSpecs(specsDir.resolve("basic.yaml"));
        List<Map<String, Object>> unionSpecs = loadSpecs(specsDir.resolve("union.yaml"));

        int executed = 0;
        executed += runDefaultSpecs(basicSpecs, "basic.yaml");
        executed += runDefaultSpecs(unionSpecs, "union.yaml");

        // basic.yaml contributes 2 "default" specs, union.yaml contributes 1.
        assertEquals(3, executed, "Expected exactly 3 default-related spec cases across basic.yaml + union.yaml");
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> loadSpecs(Path file) throws IOException {
        String content = Files.readString(file);
        Yaml yaml = new Yaml();
        Map<String, Object> yamlMap = yaml.load(content);
        return (List<Map<String, Object>>) yamlMap.get("specs");
    }

    @SuppressWarnings("unchecked")
    private int runDefaultSpecs(List<Map<String, Object>> specs, String fileName) {
        int ran = 0;
        for (Map<String, Object> spec : specs) {
            String description = (String) spec.get("description");
            if (description == null || !description.toLowerCase().contains("default")) {
                continue;
            }

            String html = (String) spec.get("input");
            Map<String, Object> configuration = (Map<String, Object>) spec.get("configuration");
            Config config = ConfigFactory.fromYAML(configuration);

            Object expected = spec.get("expected");
            Object actual = extract(config, html, "http://example.com");

            assertEquals(
                    String.valueOf(expected),
                    String.valueOf(actual),
                    fileName + " -> \"" + description + "\" mismatch");
            ran++;
        }
        return ran;
    }
}
