import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import java.io.File;
import java.io.IOException;

public class YamlSpecParser {
    public static SpecConfig parse() {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        String filepath = "java/src/main/resources/config-file.yaml";
        try {
            // Read YAML file and map it to the Config class
            File yamlFile = new File(filepath);

            return mapper.readValue(yamlFile, SpecConfig.class);

        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }
}