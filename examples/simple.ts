import { readFileSync } from 'fs';
import { cheerio, extract } from '../src';
import { ConfigFactory } from '../src/config';

const html = readFileSync('examples/simple.html').toString();
const config = ConfigFactory.fromYAML(
  readFileSync('examples/simple.yaml').toString()
);

console.log(
  'Simple parse result:',
  extract(cheerio, html, config, 'https://example.com')
);
