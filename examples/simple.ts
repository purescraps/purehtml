import { load } from 'cheerio';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { extract } from '../src';
import { ConfigFactory } from '../src/config';

const html = readFileSync('examples/simple.html').toString();
const plainConfig = parse(readFileSync('examples/simple.yaml').toString());
const config = ConfigFactory.generate(plainConfig);
const $ = load(html);

console.log('Simple parse result:', extract($, config));
