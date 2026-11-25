import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import {
  BenchmarkEmpty,
  BenchmarkResults,
  type BenchmarkData,
} from '@/components/BenchmarkResults';

// Written by `make bench SAVE=1` (see bench/README.md). Loaded with a glob so
// the site still builds when no results have been saved yet.
const files = import.meta.glob<BenchmarkData>('../data/benchmarks.json', {
  eager: true,
  import: 'default',
});
const data = Object.values(files)[0] as BenchmarkData | undefined;

export default function BenchmarksPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex-1 py-12 px-4 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fd-foreground mb-3">
          Benchmarks
        </h1>
        <p className="text-fd-muted-foreground mb-8">
          Extraction throughput of each PureHTML implementation, measured on the same HTML documents
          and configs. Higher is better.
        </p>
        {data ? <BenchmarkResults data={data} /> : <BenchmarkEmpty />}
      </div>
    </HomeLayout>
  );
}

export async function getConfig() {
  return {
    render: 'static',
  } as const;
}
