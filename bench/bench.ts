import { cheerio, ConfigFactory, extract } from "../typescript/src";
import { readFileSync } from "fs";
import { resolve } from "path";
import { parseArgs } from "util";

const currentDir = typeof __dirname !== "undefined" ? __dirname : ".";

function usage(message: string): never {
  console.error(message);
  console.error("Usage: bench.ts [--iterations N] [--url URL] [HTML YAML]");
  process.exit(2);
}

function parseCli() {
  try {
    return parseArgs({
      allowPositionals: true,
      options: {
        iterations: { type: "string", default: "5000" },
        url: { type: "string", default: "http://example.com" },
      },
    });
  } catch (err) {
    return usage(err instanceof Error ? err.message : String(err));
  }
}

function benchmark(
  htmlPath: string,
  yamlPath: string,
  url: string,
  iterations: number
) {
  const config = ConfigFactory.fromYAML(readFileSync(yamlPath, "utf-8"));
  const doc = cheerio.load(readFileSync(htmlPath, "utf-8"));

  console.log(
    `Running benchmark for ${iterations} iterations: ${htmlPath} + ${yamlPath}`
  );
  console.log("extract result:", extract(cheerio, doc, config, url));

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    extract(cheerio, doc, config, url);
  }
  const duration = performance.now() - start;
  const throughput = (iterations * 1000) / duration;

  console.log(`Throughput: ${throughput.toFixed(2)} extracts/second`);
}

const { values, positionals } = parseCli();
const iterations = Number(values.iterations);
const files =
  positionals.length > 0
    ? positionals
    : ["files/sample-1.html", "files/sample-1.yaml"].map((file) =>
        resolve(currentDir, file)
      );

if (!Number.isInteger(iterations) || iterations < 1) {
  usage("--iterations must be a positive integer");
}
if (files.length !== 2) {
  usage("expected one HTML file and one YAML file");
}

benchmark(files[0]!, files[1]!, values.url!, iterations);
