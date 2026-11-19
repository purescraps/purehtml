import { Link } from 'waku';
import { ArrowRight, Terminal, BookOpen, Layers, Cpu, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 max-w-5xl mx-auto w-full">
      <div className="text-center max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-fd-muted border border-fd-border text-fd-muted-foreground mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PureHTML Specification &amp; SDKs</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-fd-foreground mb-6">
          Extract structured data from HTML{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            declaratively.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-fd-muted-foreground leading-relaxed mb-8">
          PureHTML is a language-agnostic parsing specification that transforms unpredictable HTML into clean, validated JSON using concise YAML rules and resilient transformer pipelines.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-fd-primary text-fd-primary-foreground font-semibold text-sm shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            <BookOpen size={16} />
            <span>Read Documentation</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-fd-border bg-fd-card text-fd-foreground font-semibold text-sm hover:bg-fd-muted transition-all cursor-pointer"
          >
            <Terminal size={16} />
            <span>Interactive Playground</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
        <div className="p-6 rounded-xl border border-fd-border bg-fd-card/50 backdrop-blur-xs flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Cpu size={20} />
          </div>
          <h3 className="font-semibold text-lg text-fd-foreground">Multi-Language SDKs</h3>
          <p className="text-sm text-fd-muted-foreground">
            Native implementations for TypeScript/JavaScript, Go, Python, Java, and Ruby. Write your config once, run it in any backend.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-fd-border bg-fd-card/50 backdrop-blur-xs flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
          <h3 className="font-semibold text-lg text-fd-foreground">Composable Transformers</h3>
          <p className="text-sm text-fd-muted-foreground">
            Chain robust data pipelines like <code>trim</code>, <code>number</code>, <code>resolve</code>, <code>jsonpath</code>, and <code>regex</code> to clean data at parse time.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-fd-border bg-fd-card/50 backdrop-blur-xs flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-semibold text-lg text-fd-foreground">Resilient by Design</h3>
          <p className="text-sm text-fd-muted-foreground">
            Tolerate website redesigns and A/B test variations with fallback selector lists, union configurations, and custom default values.
          </p>
        </div>
      </div>
    </div>
  );
}

export async function getConfig() {
  return {
    render: 'static',
  };
}
