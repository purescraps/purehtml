'use client';

import { Link } from 'waku';
import { gitConfig } from '@/lib/shared';
import { useState } from 'react';
import { benchmarkSamplesByHtmlFile } from '@/examples/benchmark-sample';

export interface BenchmarkInputs {
  iterations: number | null;
  url: string;
  html: { file: string; bytes: number; sha256: string };
  config: { file: string; bytes: number; sha256: string };
}

export interface BenchmarkResult {
  throughput_per_second: number;
  iterations?: number;
  runtime: string | null;
}

export interface BenchmarkRun {
  inputs: BenchmarkInputs;
  results: Record<string, BenchmarkResult>;
}

export interface BenchmarkData {
  generated_at: string;
  environment: {
    os: {
      name: string;
      version: string | null;
      arch: string;
      build?: string | null;
    };
    cpu: {
      model: string | null;
      logical_cores: number | null;
      physical_cores: number | null;
    };
    memory_bytes: number | null;
  };
  git: { commit: string | null; dirty: boolean };
  benchmarks?: BenchmarkRun[];
  inputs?: BenchmarkInputs;
  results?: Record<string, BenchmarkResult>;
}

const LABELS: Record<string, string> = {
  go: 'Go',
  java: 'Java',
  python: 'Python',
  'python-beautifulsoup': 'Python (BeautifulSoup)',
  'python-selectolax': 'Python (Selectolax)',
  typescript: 'TypeScript',
  'ruby-nokogiri': 'Ruby (Nokogiri)',
  'ruby-nokolexbor': 'Ruby (Nokolexbor)',
};

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${bytes} B`;
}

function Sample({ inputs }: { inputs: BenchmarkInputs }) {
  const sample = benchmarkSamplesByHtmlFile[inputs.html.file];
  if (!sample) return null;

  return (
    <section>
      <h2 className="font-semibold text-fd-foreground mb-3">
        {inputs.config.file}
      </h2>
      <pre className="p-3 rounded-lg bg-fd-muted text-xs font-mono overflow-x-auto mb-4">
        {sample.config}
      </pre>
      <div className="flex flex-wrap gap-3 text-sm">
        <a
          href={sample.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-lg border border-fd-border bg-fd-card hover:bg-fd-muted transition-colors"
        >
          View HTML
        </a>
        <a
          href={sample.htmlUrl}
          download={inputs.html.file}
          className="px-3 py-1.5 rounded-lg border border-fd-border bg-fd-card hover:bg-fd-muted transition-colors"
        >
          Download HTML
        </a>
        <Link
          to={`/playground?example=${encodeURIComponent(sample.name)}`}
          className="px-3 py-1.5 rounded-lg bg-fd-primary text-fd-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Open in playground
        </Link>
      </div>
    </section>
  );
}

const nfSignificant = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
});

// Maps a ratio to a hue from red (slowest) through amber to green (fastest).
function performanceColor(ratio: number) {
  const hue = Math.round(Math.min(Math.max(ratio, 0), 1) * 120);
  return `hsl(${hue} 70% 40%)`;
}

function ThroughputTable({ run }: { run: BenchmarkRun }) {
  const keys = Object.keys(run.results).sort(
    (a, b) =>
      run.results[b]!.throughput_per_second -
      run.results[a]!.throughput_per_second,
  );
  const fastest = Math.max(
    ...Object.values(run.results).map((result) => result.throughput_per_second),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fd-border text-left text-fd-muted-foreground">
            <th className="py-2 pr-4 font-medium">Implementation</th>
            <th className="py-2 pl-4 text-right font-medium">Extracts/second</th>
            <th className="py-2 pl-4 text-right font-medium">Baseline performance</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => {
            const value = run.results[key]!.throughput_per_second;
            return (
              <tr key={key} className="border-b border-fd-border last:border-0">
                <th className="py-2 pr-4 text-left font-medium text-fd-foreground">
                  {LABELS[key] ?? key}
                </th>
                <td className="py-2 pl-4 text-right font-mono tabular-nums text-fd-foreground">
                  {nfSignificant.format(value)}
                </td>
                <td
                  className="py-2 pl-4 text-right font-mono tabular-nums font-semibold"
                  style={{ color: performanceColor(value / fastest) }}
                >
                  {Number((value / fastest).toFixed(2))}x
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function BenchmarkEmpty() {
  return (
    <div className="p-6 rounded-xl border border-dashed border-fd-border text-fd-muted-foreground">
      No benchmark results have been published yet. Run{' '}
      <code className="font-mono text-fd-foreground">make bench SAVE=1</code>{' '}
      from the repository root to generate them.
    </div>
  );
}

export function BenchmarkResults({ data }: { data: BenchmarkData }) {
  const { environment: env, git } = data;
  const runs: BenchmarkRun[] =
    data.benchmarks ??
    (data.inputs && data.results
      ? [{ inputs: data.inputs, results: data.results }]
      : []);

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (runs.length === 0) {
    return <BenchmarkEmpty />;
  }

  const activeRun = runs[selectedIndex] ?? runs[0]!;
  const { inputs } = activeRun;

  return (
    <div className="flex flex-col gap-6">
      {git.dirty && (
        <div className="p-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-sm text-fd-foreground">
          These results were recorded with uncommitted changes, so they may not
          match commit <code className="font-mono">{git.commit}</code>.
        </div>
      )}

      {runs.length > 1 && (
        <div
          className="flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="Benchmark sample"
        >
          {runs.map((run, index) => {
            const active = index === selectedIndex;
            return (
              <button
                key={run.inputs.html.file}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedIndex(index)}
                className={`px-2 py-0.5 rounded-md text-xs font-mono border transition-colors cursor-pointer ${
                  active
                    ? 'bg-fd-primary text-fd-primary-foreground border-fd-primary font-semibold'
                    : 'bg-fd-card text-fd-muted-foreground border-fd-border hover:text-fd-foreground hover:bg-fd-muted'
                }`}
              >
                {run.inputs.html.file}
              </button>
            );
          })}
        </div>
      )}

      <ThroughputTable run={activeRun} />

      <Sample inputs={inputs} />

      <p className="text-xs text-fd-muted-foreground">
        Measured on {[env.os.name, env.os.version].filter(Boolean).join(' ')}{' '}
        with {env.cpu.model ?? 'an unknown processor'}. Recorded{' '}
        {new Date(data.generated_at).toISOString().slice(0, 10)} at commit{' '}
        {git.commit ? (
          <a
            className="font-mono underline"
            href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/commit/${git.commit}`}
          >
            {git.commit}
          </a>
        ) : (
          'unknown'
        )}
        . Numbers depend heavily on hardware, so compare implementations with
        each other rather than against other machines.
      </p>
    </div>
  );
}
