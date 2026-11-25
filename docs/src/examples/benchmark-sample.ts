import type { Example } from './example';
// Single source of truth: the same files `make bench` runs against. The HTML
// files are 1–2.5 MiB, so they are emitted as separate assets and fetched on
// demand instead of being bundled into the page's JavaScript.
import sample1Config from '../../../bench/files/sample-1.yaml?raw';
import sample1HtmlUrl from '../../../bench/files/sample-1.html?url';
import sample2Config from '../../../bench/files/sample-2.yml?raw';
import sample2HtmlUrl from '../../../bench/files/sample-2.html?url';

export interface BenchmarkExample extends Example {
  htmlFile: string;
  sizeLabel: string;
}

export const benchmarkSample1: BenchmarkExample = {
  name: 'Benchmark sample 1',
  htmlFile: 'sample-1.html',
  sizeLabel: '1.0 MiB page',
  html: '',
  htmlUrl: sample1HtmlUrl,
  config: sample1Config,
  url: 'http://example.com',
};

export const benchmarkSample2: BenchmarkExample = {
  name: 'Benchmark sample 2',
  htmlFile: 'sample-2.html',
  sizeLabel: '2.5 MiB page',
  html: '',
  htmlUrl: sample2HtmlUrl,
  config: sample2Config,
  url: 'http://example.com',
};

export const benchmarkSamples: BenchmarkExample[] = [benchmarkSample1, benchmarkSample2];

export const benchmarkSamplesByHtmlFile: Record<string, BenchmarkExample> = Object.fromEntries(
  benchmarkSamples.map((sample) => [sample.htmlFile, sample]),
);
