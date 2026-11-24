// Run a PureHTML schema against an HTML file using the in-repo TypeScript port.
// Usage: bun extract.ts <schema.yaml> <page.html> [baseUrl]
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ConfigFactory, cheerio, extract } from '../../../../typescript/src';

const [schemaPath, htmlPath, baseUrl = 'https://example.com/'] =
  process.argv.slice(2);

if (!schemaPath || !htmlPath) {
  console.error('Usage: bun extract.ts <schema.yaml> <page.html> [baseUrl]');
  process.exit(2);
}

const yaml = readFileSync(resolve(schemaPath), 'utf8');
const html = readFileSync(resolve(htmlPath), 'utf8');

let config: ReturnType<typeof ConfigFactory.fromYAML>;
try {
  config = ConfigFactory.fromYAML(yaml);
} catch (e) {
  console.error(`SCHEMA INVALID: ${(e as Error).message}`);
  process.exit(1);
}

const result = extract(cheerio, html, config, baseUrl);
console.log(JSON.stringify(result, null, 2));
