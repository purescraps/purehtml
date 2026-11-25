import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { gitConfig } from '@/lib/shared';

// Written by `make bench SAVE=1` (see bench/README.md). Loaded with a glob so
// the site still builds when no results have been saved yet.
interface BenchmarkData {
  generated_at: string;
  environment: {
    os: { name: string; version: string | null; arch: string; build?: string | null };
    cpu: { model: string | null; logical_cores: number | null; physical_cores: number | null };
    memory_bytes: number | null;
  };
  git: { commit: string | null; dirty: boolean };
  inputs: {
    iterations: number;
    url: string;
    html: { file: string; bytes: number; sha256: string };
    config: { file: string; bytes: number; sha256: string };
  };
  results: Record<string, { throughput_per_second: number; runtime: string | null }>;
}

const files = import.meta.glob<BenchmarkData>('../data/benchmarks.json', {
  eager: true,
  import: 'default',
});
const data = Object.values(files)[0] as BenchmarkData | undefined;

const LABELS: Record<string, string> = {
  go: 'Go',
  java: 'Java',
  python: 'Python',
  typescript: 'TypeScript',
  'ruby-nokogiri': 'Ruby (Nokogiri)',
  'ruby-nokolexbor': 'Ruby (Nokolexbor)',
};

const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${bytes} B`;
}

function formatMemory(bytes: number | null) {
  return bytes ? `${Math.round(bytes / 1024 ** 3)} GiB` : 'unknown';
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-fd-border last:border-0 text-sm">
      <dt className="text-fd-muted-foreground">{label}</dt>
      <dd className="text-fd-foreground text-right font-mono break-all">{value}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="p-5 rounded-xl border border-fd-border bg-fd-card/50">
      <h2 className="font-semibold text-fd-foreground mb-2">{title}</h2>
      <dl>{children}</dl>
    </section>
  );
}

export default function BenchmarksPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex-1 py-12 px-4 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fd-foreground mb-3">
          Benchmarks
        </h1>
        <p className="text-fd-muted-foreground mb-8">
          Extraction throughput of each PureHTML implementation, measured on the same HTML document
          and config. Higher is better.
        </p>
        {data ? <Results data={data} /> : <Empty />}
      </div>
    </HomeLayout>
  );
}

function Empty() {
  return (
    <div className="p-6 rounded-xl border border-dashed border-fd-border text-fd-muted-foreground">
      No benchmark results have been published yet. Run{' '}
      <code className="font-mono text-fd-foreground">make bench SAVE=1</code> from the repository
      root to generate them.
    </div>
  );
}

function Results({ data }: { data: BenchmarkData }) {
  const { environment: env, inputs, git } = data;
  const rows = Object.entries(data.results).sort(
    (a, b) => b[1].throughput_per_second - a[1].throughput_per_second,
  );
  const fastest = rows[0]?.[1].throughput_per_second ?? 1;

  return (
    <div className="flex flex-col gap-6">
      {git.dirty && (
        <div className="p-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-sm text-fd-foreground">
          These results were recorded with uncommitted changes, so they may not match commit{' '}
          <code className="font-mono">{git.commit}</code>.
        </div>
      )}

      <section className="p-5 rounded-xl border border-fd-border bg-fd-card/50">
        <h2 className="font-semibold text-fd-foreground mb-4">Throughput (extracts/second)</h2>
        <ul className="flex flex-col gap-4">
          {rows.map(([key, result]) => {
            const value = result.throughput_per_second;
            return (
              <li key={key}>
                <div className="flex justify-between items-baseline gap-4 text-sm mb-1">
                  <span className="font-medium text-fd-foreground">{LABELS[key] ?? key}</span>
                  <span className="font-mono text-fd-foreground">
                    {nf.format(value)}
                    {value !== fastest && (
                      <span className="text-fd-muted-foreground">
                        {' '}
                        · {(fastest / value).toFixed(1)}x slower
                      </span>
                    )}
                  </span>
                </div>
                <div
                  className="h-3 rounded-full bg-fd-muted overflow-hidden"
                  role="img"
                  aria-label={`${LABELS[key] ?? key}: ${nf.format(value)} extracts per second`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    style={{ width: `${Math.max((value / fastest) * 100, 0.5)}%` }}
                  />
                </div>
                {result.runtime && (
                  <div className="text-xs text-fd-muted-foreground mt-1 font-mono">
                    {result.runtime}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Environment">
          <Row label="OS" value={[env.os.name, env.os.version].filter(Boolean).join(' ')} />
          <Row label="Architecture" value={env.os.arch} />
          <Row label="CPU" value={env.cpu.model ?? 'unknown'} />
          <Row
            label="Cores"
            value={`${env.cpu.physical_cores ?? '?'} physical / ${env.cpu.logical_cores ?? '?'} logical`}
          />
          <Row label="Memory" value={formatMemory(env.memory_bytes)} />
        </Card>

        <Card title="Inputs">
          <Row label="Iterations" value={nf.format(inputs.iterations)} />
          <Row label="HTML" value={`${inputs.html.file} (${formatBytes(inputs.html.bytes)})`} />
          <Row label="Config" value={`${inputs.config.file} (${formatBytes(inputs.config.bytes)})`} />
          <Row label="Base URL" value={inputs.url} />
          <Row label="HTML SHA-256" value={inputs.html.sha256.slice(0, 12)} />
        </Card>
      </div>

      <p className="text-xs text-fd-muted-foreground">
        Recorded {new Date(data.generated_at).toISOString().slice(0, 10)} at commit{' '}
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
        . Numbers depend heavily on hardware, so compare implementations with each other rather
        than against other machines.
      </p>
    </div>
  );
}

export async function getConfig() {
  return {
    render: 'static',
  } as const;
}
