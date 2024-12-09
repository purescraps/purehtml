import { cheerio, ConfigFactory, extract } from "@purescraps/purehtml";
import { readFileSync } from "fs";

const iterations = 10000;
const html = readFileSync("files/sample-1.html").toString();
const config = ConfigFactory.fromYAML(
  readFileSync("files/sample-1.yaml").toString()
);
const doc = cheerio.load(html);

console.log(`Running benchmark for ${iterations} iterations.`);

console.log(
  `extract result: ${extract(cheerio, doc, config, "http://example.com")}`
);

const start = Date.now();
for (let i = 0; i < iterations; i++) {
  extract(cheerio, doc, config, "https://example.com");
}
const duration = Date.now() - start;
const throughput = (iterations * 1000) / duration;

console.log(`Throughput: ${throughput.toFixed(2)} extracts/second`);
