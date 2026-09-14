package com.purescraps.purehtml.configs;

import org.yaml.snakeyaml.Yaml;

import com.purescraps.purehtml.Validator;
import com.purescraps.purehtml.configs.types.*;
import com.purescraps.purehtml.transformers.Transformer;
import com.purescraps.purehtml.transformers.TransformerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ConfigFactory {

    public static Config fromYAML(String yaml) {
        Yaml parser = new Yaml();
        Map<String, Object> plain = parser.load(yaml);
        if (Validator.validate(yaml))
            return generate(plain);
        return null;
    }

    public static Config fromYAML(Map<String, Object> plain) {
        return generate(plain);
    }

    @SuppressWarnings("unchecked")
    private static Config generate(Map<String, Object> plain) {

        Object constant = plain.get("constant");
        Object selectorOrig = plain.get("selector");
        Object transformOrig = plain.get("transform");
        Object properties = plain.get("properties");
        Object items = plain.get("items");
        Object union = plain.get("union");
        String selector = generateSelector(selectorOrig);
        String expectedType = detectExpectedType(plain);
        List<Transformer> transformers;
        transformers = generateTransform(transformOrig);
        Config config;
        switch (expectedType) {
            case "constant":
                config = new ConstantConfig(constant, selector);
                break;
            case "object":
                Map<String, Config> propConfigs = null;
                if (properties instanceof Map<?, ?>) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> propertiesMap = (Map<String, Object>) properties;

                    propConfigs = propertiesMap.entrySet().stream()
                            .filter(entry -> entry.getValue() instanceof Map<?, ?>) // Validate entry value type
                            .collect(Collectors.toMap(
                                    Map.Entry::getKey,
                                    entry -> {
                                        @SuppressWarnings("unchecked")
                                        Map<String, Object> valueMap = (Map<String, Object>) entry.getValue();
                                        return generate(valueMap);
                                    }));
                }
                config = new ObjectConfig(selector, propConfigs);
                break;
            case "array":
                config = new ArrayConfig(selector, items != null ? generate((Map<String, Object>) items) : null,
                        transformers);
                break;
            case "union":
                config = new UnionConfig(((List<Map<String, Object>>) union).stream()
                        .map(ConfigFactory::generate)
                        .collect(Collectors.toList()));
                break;
            default:
                config = new PrimitiveValueConfig(selector, appendTypeCoercion(plain.get("type"), transformers));

        }

        if (plain.containsKey("default")) {
            return new DefaultValueConfig(config, plain.get("default"));
        }

        return config;
    }

    /**
     * `type: number` / `type: boolean` on a primitive value are sugar for
     * appending the corresponding transformer to the end of the transform
     * chain, so the extracted value is coerced even when no explicit
     * `transform` is provided. `type: string` (or no type) is left as-is.
     */
    private static List<Transformer> appendTypeCoercion(Object type, List<Transformer> transformers) {
        if (!"number".equals(type) && !"boolean".equals(type)) {
            return transformers;
        }

        List<Transformer> result = transformers != null ? new ArrayList<>(transformers) : new ArrayList<>();
        result.add(TransformerFactory.create((String) type));
        return result;
    }

    private static String generateSelector(Object selectorOrig) {
        if (selectorOrig instanceof String) {
            return (String) selectorOrig;
        }

        if (selectorOrig instanceof List) {

            return ((List<?>) selectorOrig).stream()
                    .map(Object::toString)
                    .collect(Collectors.joining(", "));
        }

        if (selectorOrig instanceof Map) {

            return generateSelector(((Map<?, ?>) selectorOrig).get("selector"));
        }

        if (selectorOrig == null) {
            return null;
        }

        throw new IllegalArgumentException("Unexpected selector type: " + selectorOrig.getClass().getName());
    }

    private static List<Transformer> generateTransform(Object transformOrig) {

        List<Transformer> transform = new ArrayList<>();
        if (transformOrig == null)
            return null;
        if (transformOrig instanceof String) {

            transform.add(TransformerFactory.create((String) transformOrig));
            return transform;

        }
        @SuppressWarnings("unchecked")
        List<String> transforms = (List<String>) transformOrig;
        return transforms.stream()
                .map(TransformerFactory::create)
                .collect(Collectors.toList());

    }

    private static String detectExpectedType(Map<String, Object> conf) {

        if (conf.containsKey("properties") || "object".equals(conf.get("type"))) {

            return "object";
        }

        if (conf.containsKey("items") || "array".equals(conf.get("type"))) {
            return "array";
        }

        if (conf.containsKey("union")) {
            return "union";
        }

        if (conf.containsKey("constant")) {
            return "constant";
        }

        return "primitive";
    }
}
