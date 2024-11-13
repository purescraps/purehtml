/**
 * import com.fasterxml.jackson.annotation.JsonProperty;
 * import com.fasterxml.jackson.databind.ObjectMapper;
 *
 * import java.io.IOException;
 * import java.util.List;
 * import java.util.Map;
 * import java.util.Objects;
 *
 * // Base class representing the common schema configuration
 * public class ConfigSchema3 {
 *     private String selector;
 *     private String type;
 *     private ConfigSchema items;
 *     private Map<String, ConfigSchema> properties;
 *     private Object transform;  // Can be String or List<String>
 *     private List<ConfigSchema> union;
 *     private Map<String, Object> constant;
 *
 *     // Constructor for WithSelector, UnionConfig, ConstantConfig
 *     public ConfigSchema(String selector, String type, ConfigSchema items, Map<String, ConfigSchema> properties,
 *                         Object transform, List<ConfigSchema> union, Map<String, Object> constant) {
 *         this.selector = selector;
 *         this.type = type;
 *         this.items = items;
 *         this.properties = properties;
 *         this.transform = transform;
 *         this.union = union;
 *         this.constant = constant;
 *     }
 *
 *     public ConfigSchema() {
 *
 *     }
 *
 *     // Getters and Setters
 *     public String getSelector() {
 *         return selector;
 *     }
 *
 *     public void setSelector(String selector) {
 *         this.selector = selector;
 *     }
 *
 *     public String getType() {
 *         return type;
 *     }
 *
 *     public void setType(String type) {
 *         this.type = type;
 *     }
 *
 *     public ConfigSchema getItems() {
 *         return items;
 *     }
 *
 *     public void setItems(ConfigSchema items) {
 *         this.items = items;
 *     }
 *
 *     public Map<String, ConfigSchema> getProperties() {
 *         return properties;
 *     }
 *
 *     public void setProperties(Map<String, ConfigSchema> properties) {
 *         this.properties = properties;
 *     }
 *
 *     public Object getTransform() {
 *         return transform;
 *     }
 *
 *     public void setTransform(Object transform) {
 *         this.transform = transform;
 *     }
 *
 *     public List<ConfigSchema> getUnion() {
 *         return union;
 *     }
 *
 *     public void setUnion(List<ConfigSchema> union) {
 *         this.union = union;
 *     }
 *
 *     public Map<String, Object> getConstant() {
 *         return constant;
 *     }
 *
 *     public void setConstant(Map<String, Object> constant) {
 *         this.constant = constant;
 *     }
 *
 *     @Override
 *     public String toString() {
 *         return "ConfigSchema{" +
 *                 "selector='" + selector + '\'' +
 *                 ", type='" + type + '\'' +
 *                 ", items=" + items +
 *                 ", properties=" + properties +
 *                 ", transform=" + transform +
 *                 ", union=" + union +
 *                 ", constant=" + constant +
 *                 '}';
 *     }
 *
 *     // Additional helper methods, if needed, to validate the schema logic
 * }
 *
 * // WithSelector configuration class
 * class WithSelector extends ConfigSchema {
 *     public WithSelector(String selector, String type, ConfigSchema items, Map<String, ConfigSchema> properties,
 *                         Object transform) {
 *         super(selector, type, items, properties, transform, null, null);
 *     }
 * }
 *
 * // Union configuration class
 * class UnionConfig extends ConfigSchema {
 *     public UnionConfig(List<ConfigSchema> union) {
 *         super(null, null, null, null, null, union, null);
 *     }
 * }
 *
 * // Constant configuration class
 * class ConstantConfig extends ConfigSchema {
 *
 *     public ConstantConfig(String selector, Map<String, Object> constant) {
 *         super(selector, null, null, null, null, null, constant);
 *     }
 * }
 *
 *
 * /** Example usage
 *  public class Main {
 *  public static void main(String[] args) {
 *  // Creating a WithSelector object (type "array" with "items")
 *  ConfigSchema itemConfig = new ConfigSchema("itemSelector", "string", null, null, null, null, null);
 *  WithSelector withSelectorExample = new WithSelector("exampleSelector", "array", itemConfig, null, "transformExample");
 *
 *  // Creating a UnionConfig object (contains multiple schemas)
 *  UnionConfig unionConfigExample = new UnionConfig(List.of(
 *  new WithSelector("exampleSelector1", "string", null, null, null),
 *  new ConstantConfig("constantSelector", Map.of("key", "value"))
 *  ));
 *
 *  // Creating a ConstantConfig object
 *  ConstantConfig constantConfigExample = new ConstantConfig("constantSelector", Map.of("key", "value"));
 *
 *  // Print examples
 *  System.out.println(withSelectorExample);
 *  System.out.println(unionConfigExample);
 *  System.out.println(constantConfigExample);
 *  }
 *  }
 *  **/
