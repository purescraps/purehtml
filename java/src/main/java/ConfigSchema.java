import java.util.List;
import java.util.Map;
// Base class representing the common schema configuration
@SuppressWarnings("unused")
public class ConfigSchema {
    private String selector;
    private String type;
    private ConfigSchema items;
    private Map<String, ConfigSchema> properties;
    private Object transform;  // Can be String or List<String>
    private List<ConfigSchema> union;
    private Object constant;

    // Constructor for WithSelector, UnionConfig, ConstantConfig
    public ConfigSchema(String selector, String type, ConfigSchema items, Map<String, ConfigSchema> properties,
                        Object transform, List<ConfigSchema> union, Object constant) {
        this.selector = selector;
        this.type = type;
        this.items = items;
        this.properties = properties;
        this.transform = transform;
        this.union = union;
        this.constant = constant;
    }

    public ConfigSchema() {

    }

    // Getters and Setters
    public String getSelector() {
        return selector;
    }

    public void setSelector(String selector) {
        this.selector = selector;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ConfigSchema getItems() {
        return items;
    }

    public void setItems(ConfigSchema items) {
        this.items = items;
    }

    public Map<String, ConfigSchema> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, ConfigSchema> properties) {
        this.properties = properties;
    }

    public Object getTransform() {
        return transform;
    }

    public void setTransform(Object transform) {
        this.transform = transform;
    }

    public List<ConfigSchema> getUnion() {
        return union;
    }

    public void setUnion(List<ConfigSchema> union) {
        this.union = union;
    }

    public Object getConstant() {
        return constant;
    }

    public void setConstant(Object constant) {
        this.constant = constant;
    }

    @Override
    public String toString() {
        return "ConfigSchema{" +
                "selector='" + selector + '\'' +
                ", type='" + type + '\'' +
                ", items=" + items +
                ", properties=" + properties +
                ", transform=" + transform +
                ", union=" + union +
                ", constant=" + constant +
                '}';
    }

    // Additional helper methods, if needed, to validate the schema logic
}

// WithSelector configuration class
@SuppressWarnings("unused")
class WithSelector extends ConfigSchema {
    public WithSelector(String selector, String type, ConfigSchema items, Map<String, ConfigSchema> properties,
                        Object transform) {
        super(selector, type, items, properties, transform, null, null);
    }
}

// Union configuration class
@SuppressWarnings("unused")
class UnionConfig extends ConfigSchema {
    public UnionConfig(List<ConfigSchema> union) {
        super(null, null, null, null, null, union, null);
    }
}

// Constant configuration class
@SuppressWarnings("unused")
class ConstantConfig extends ConfigSchema {

    public ConstantConfig(String selector, Object constant) {
        super(selector, null, null, null, null, null, constant);
    }
}