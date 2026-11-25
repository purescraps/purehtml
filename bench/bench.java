import com.purescraps.purehtml.PureHTML;
import com.purescraps.purehtml.backend.JsoupBackend;
import com.purescraps.purehtml.backend.PureHTMLDocument;
import com.purescraps.purehtml.configs.Config;
import com.purescraps.purehtml.configs.ConfigFactory;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

class Bench {
    public static void main(String[] args) throws Exception {
        int iterations = 20;
        String url = "http://example.com";
        List<Path> files = new ArrayList<>();

        for (int i = 0; i < args.length; i++) {
            String arg = args[i];
            if (!arg.startsWith("--")) {
                files.add(Paths.get(arg));
                continue;
            }

            String name = arg;
            String value = null;
            int eq = arg.indexOf('=');
            if (eq >= 0) {
                name = arg.substring(0, eq);
                value = arg.substring(eq + 1);
            } else if (i + 1 < args.length) {
                value = args[++i];
            }
            if (value == null) {
                usage("missing value for " + name);
            }

            switch (name) {
                case "--iterations" -> iterations = parseIterations(value);
                case "--url" -> url = value;
                default -> usage("unknown option " + name);
            }
        }

        if (files.isEmpty()) {
            Path dir = getScriptDir();
            files.add(dir.resolve("files/sample-2.html"));
            files.add(dir.resolve("files/sample-2.yml"));
        }
        if (files.size() != 2) {
            usage("expected one HTML file and one YAML file");
        }

        benchmark(files.get(0), files.get(1), url, iterations);
    }

    private static void benchmark(Path htmlPath, Path yamlPath, String url, int iterations) throws Exception {
        Config config = ConfigFactory.fromYAML(read(yamlPath));
        PureHTMLDocument doc = JsoupBackend.load(read(htmlPath));

        System.out.printf("Running benchmark for %d iterations: %s + %s%n", iterations, htmlPath, yamlPath);
        System.out.println("extract result: " + PureHTML.extract(config, doc, url));

        long start = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            PureHTML.extract(config, doc, url);
        }
        double durationSeconds = (System.nanoTime() - start) / 1_000_000_000.0;
        double throughput = iterations / durationSeconds;

        System.out.printf("Throughput: %.2f extracts/second%n", throughput);
    }

    // Arbitrary pages may contain invalid UTF-8, which Files.readString rejects.
    private static String read(Path path) throws IOException {
        return new String(Files.readAllBytes(path), StandardCharsets.UTF_8);
    }

    private static int parseIterations(String value) {
        try {
            int iterations = Integer.parseInt(value);
            if (iterations > 0) {
                return iterations;
            }
        } catch (NumberFormatException ignored) {
        }
        usage("--iterations must be a positive integer");
        return 0;
    }

    private static void usage(String message) {
        System.err.println(message);
        System.err.println("Usage: bench.java [--iterations N] [--url URL] [HTML YAML]");
        System.exit(2);
    }

    private static Path getScriptDir() {
        try {
            Path codeSourcePath = Paths.get(
                Bench.class.getProtectionDomain().getCodeSource().getLocation().toURI()
            );
            if (Files.isDirectory(codeSourcePath)) {
                if (Files.exists(codeSourcePath.resolve("files/sample-2.yml"))) {
                    return codeSourcePath;
                }
            } else {
                Path parent = codeSourcePath.getParent();
                if (parent != null && Files.exists(parent.resolve("files/sample-2.yml"))) {
                    return parent;
                }
            }
        } catch (Exception ignored) {
        }

        Path current = Paths.get("").toAbsolutePath();
        if (Files.exists(current.resolve("files/sample-2.yml"))) {
            return current;
        }
        if (Files.exists(current.resolve("bench/files/sample-2.yml"))) {
            return current.resolve("bench");
        }
        return current;
    }
}
