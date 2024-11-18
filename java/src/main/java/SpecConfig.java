import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
//ignore unknown is used for ignoring things like $schema.
@JsonIgnoreProperties(ignoreUnknown = true)
//Suppress Warning is used because they all used for serialization, but we are not using them directly.
@SuppressWarnings("unused")
public class SpecConfig {

    private String description;

    private List<Spec> specs;

    /**
     * No args constructor for use in serialization
     *
     */
    public SpecConfig() {
    }

    public SpecConfig(String description, List<Spec> specs) {
        super();
        this.description = description;
        this.specs = specs;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public SpecConfig withDescription(String description) {
        this.description = description;
        return this;
    }

    public List<Spec> getSpecs() {
        return specs;
    }

    public void setSpecs(List<Spec> specs) {
        this.specs = specs;
    }

    public SpecConfig withSpecs(List<Spec> specs) {
        this.specs = specs;
        return this;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(SpecConfig.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this))).append('[');
        sb.append("description");
        sb.append('=');
        sb.append(((this.description == null)?"<null>":this.description));
        sb.append(',');
        sb.append("specs");
        sb.append('=');
        sb.append(((this.specs == null)?"<null>":this.specs));
        sb.append(',');
        if (sb.charAt((sb.length()- 1)) == ',') {
            sb.setCharAt((sb.length()- 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}
