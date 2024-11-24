package com.purescraps.purehtml.configs;
import com.purescraps.purehtml.configs.types.*;
import com.purescraps.purehtml.transformers.Transformer;
import com.purescraps.purehtml.transformers.TransformerFactory;
import org.yaml.snakeyaml.Yaml;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ConfigFactory {

    public static Config fromYAML(String yaml) {
        Yaml parser = new Yaml();
        Map<String, Object> plain = parser.load(yaml);
        return generate(plain);
    }
    private static Config generate(Map<String, Object> plain) {

        Map<String, Object> errors = null;
        if (errors != null) {
            throw new IllegalArgumentException(
                    String.format("Invalid config provided. Got validation errors: %s. Plain config: %s",
                            errors.toString(), plain.toString()));
        }
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
        switch (expectedType) {
            case "constant":
                return new ConstantConfig(constant, selector);
            case "object":
                Map<String, Config> propConfigs = null;
                if (properties != null) {

                    propConfigs = ((Map<String, Object>) properties).entrySet().stream()
                            .collect(Collectors.toMap(
                                    Map.Entry::getKey,
                                    entry -> generate((Map<String, Object>) entry.getValue())
                            ));
                }
                return new ObjectConfig(selector, propConfigs);
            case "array":
                return new ArrayConfig(selector,items != null ? generate((Map<String, Object>) items) : null , transformers);
            case "union":
                return new UnionConfig(((List<Map<String, Object>>) union).stream()
                        .map(ConfigFactory::generate)
                        .collect(Collectors.toList()));
            default:
                return new PrimitiveValueConfig(selector, transformers);

        }
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
        if(transformOrig == null)
            return null;
        if(transformOrig instanceof String)
        {

            transform.add(TransformerFactory.create((String) transformOrig));
            return  transform;

        }
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
