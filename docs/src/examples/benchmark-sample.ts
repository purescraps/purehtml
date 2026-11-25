import type { Example } from './example';
// Single source of truth: the same files `make bench` runs against. The HTML is
// about 1 MiB, so it is emitted as a separate asset and fetched on demand
// instead of being bundled into the page's JavaScript.
import config from '../../../bench/files/sample-1.yaml?raw';
import htmlUrl from '../../../bench/files/sample-1.html?url';

export const benchmarkSampleName = 'Benchmark sample';

export const benchmarkSample: Example = {
  name: benchmarkSampleName,
  html: '',
  htmlUrl,
  config,
  url: 'http://example.com',
};
