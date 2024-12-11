# PureHTML
**PureHTML** is a parsing specification for extracting JSON from HTML.

[Documentation](https://purescraps.github.io/purehtml/)
We use maven for dependency management.



### Installation
1. #### For Maven Projects:
*  Add this dependency to your pom.xml file :
```
        <dependency>
            <groupId>org.purescraps.purehtml</groupId>
            <artifactId>purehtml</artifactId>
            <version>0.1.0</version>
        </dependency>
```

Make sure you have `maven` installed in your environment.

* Install the dependencies: `mvn clean install`

## Usage
```java
import org.purescraps.purehtml.configs.Config;
import org.purescraps.purehtml.configs.ConfigFactory;

public class Main {
    public static void main(String[] args) {
        String yamlString = """
                    selector: span
                    type: array
                    items: {}
                """;

        String htmlString = """
                    <div>
                        <span>a</span>
                        <span>b</span>
                        <span>c</span>
                    </div>
                """;

        String expectedOutput = "[a, b, c]";

        Config config = ConfigFactory.fromYAML(yamlString);
        Object extractedOutput = extract(config, htmlString, "http://example.com");

        System.out.println("Extracted output: " + extractedOutput);
        System.out.println("Expected output: " + expectedOutput);
    }
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)