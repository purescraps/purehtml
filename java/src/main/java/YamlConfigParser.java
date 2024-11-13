import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import java.io.File;
import java.io.IOException;

public class YamlConfigParser {
    public static ConfigSchema parse() {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());

        try {
            // Read YAML file and map it to the Config class
            File yamlFile = new File("java/src/main/resources/config-file.yaml");

            return mapper.readValue(yamlFile, ConfigSchema.class);

        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }
}