import com.purescraps.purehtml.PureHTML;
import com.purescraps.purehtml.backend.JsoupBackend;
import com.purescraps.purehtml.backend.PureHTMLDocument;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.configs.ConfigFactory;

import java.io.File;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

class Bench {
    public static void main(String[] args) throws Exception {
        int iterations = 5000;

        Path dir = getScriptDir();
        Path yamlPath = dir.resolve("files/sample-1.yaml");
        Path htmlPath = dir.resolve("files/sample-1.html");

        String yaml = Files.readString(yamlPath);
        String html = Files.readString(htmlPath);

        Config config = ConfigFactory.fromYAML(yaml);
        PureHTMLDocument doc = JsoupBackend.load(html);

        System.out.printf("Running benchmark for %d iterations.%n", iterations);
        System.out.println("extract result: " + PureHTML.extract(config, doc, "http://example.com"));

        long start = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            PureHTML.extract(config, doc, "http://example.com");
        }
        long durationNano = System.nanoTime() - start;
        double durationSeconds = durationNano / 1_000_000_000.0;
        double throughput = iterations / durationSeconds;

        System.out.printf("Throughput: %.2f extracts/second%n", throughput);
    }

    private static Path getScriptDir() {
        try {
            Path codeSourcePath = Paths.get(
                Bench.class.getProtectionDomain().getCodeSource().getLocation().toURI()
            );
            if (Files.isDirectory(codeSourcePath)) {
                if (Files.exists(codeSourcePath.resolve("files/sample-1.yaml"))) {
                    return codeSourcePath;
                }
            } else {
                Path parent = codeSourcePath.getParent();
                if (parent != null && Files.exists(parent.resolve("files/sample-1.yaml"))) {
                    return parent;
                }
            }
        } catch (Exception ignored) {
        }

        Path current = Paths.get("").toAbsolutePath();
        if (Files.exists(current.resolve("files/sample-1.yaml"))) {
            return current;
        }
        if (Files.exists(current.resolve("bench/files/sample-1.yaml"))) {
            return current.resolve("bench");
        }
        return current;
    }
}
