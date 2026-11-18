import { cheerio, ConfigFactory, extract } from "../typescript/src";
import { readFileSync } from "fs";
import { resolve } from "path";

const currentDir = typeof __dirname !== "undefined" ? __dirname : ".";

const iterations = 5000;
const html = readFileSync(resolve(currentDir, "files/sample-1.html"), "utf-8");
const config = ConfigFactory.fromYAML(
  readFileSync(resolve(currentDir, "files/sample-1.yaml"), "utf-8")
);
const doc = cheerio.load(html);

console.log(`Running benchmark for ${iterations} iterations.`);

console.log(
  "extract result:",
  extract(cheerio, doc, config, "http://example.com")
);

const start = Date.now();
for (let i = 0; i < iterations; i++) {
  extract(cheerio, doc, config, "http://example.com");
}
const duration = Date.now() - start;
const throughput = (iterations * 1000) / duration;

console.log(`Throughput: ${throughput.toFixed(2)} extracts/second`);
