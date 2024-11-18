//Suppress Warning is used because they all used for serialization, but we are not using them directly.
@SuppressWarnings("unused")
public class Spec {

    private String description;

    private Object configuration;

    private String input;

    private Object expected;

    public Spec() {
    }

    public Spec(String description, Object configuration, String input, Object expected) {
        super();
        this.description = description;
        this.configuration = configuration;
        this.input = input;
        this.expected = expected;
    }
String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Spec withDescription(String description) {
        this.description = description;
        return this;
    }

    public Object getConfiguration() {
        return configuration;
    }

    public void setConfiguration(Object configuration) {
        this.configuration = configuration;
    }

    public Spec withConfiguration(Object configuration) {
        this.configuration = configuration;
        return this;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public Spec withInput(String input) {
        this.input = input;
        return this;
    }

    public Object getExpected() {
        return expected;
    }

    public void setExpected(Object expected) {
        this.expected = expected;
    }

    public Spec withExpected(Object expected) {
        this.expected = expected;
        return this;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(Spec.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this))).append('[');
        sb.append("description");
        sb.append('=');
        sb.append(((this.description == null)?"<null>":this.description));
        sb.append(',');
        sb.append("configuration");
        sb.append('=');
        sb.append(((this.configuration == null)?"<null>":this.configuration));
        sb.append(',');
        sb.append("input");
        sb.append('=');
        sb.append(((this.input == null)?"<null>":this.input));
        sb.append(',');
        sb.append("expected");
        sb.append('=');
        sb.append(((this.expected == null)?"<null>":this.expected));
        sb.append(',');
        if (sb.charAt((sb.length()- 1)) == ',') {
            sb.setCharAt((sb.length()- 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}
