'use client';

import { Editor } from '@monaco-editor/react';
import {
  Code,
  FileCode,
  FileText,
  Settings,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { type Example, examples } from './examples';
import { usePureHtml } from './hooks/usePureHtml';

const STORAGE_KEY = 'purehtml-playground-state';

interface StoredState {
  html: string;
  config: string;
}

function loadStoredState(): StoredState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (typeof parsed.html !== 'string' || typeof parsed.config !== 'string') {
      return null;
    }

    return parsed;
  } catch (err) {
    console.error('Cannot read stored playground state:', err);
    return null;
  }
}

export function Playground() {
  const [storedState] = useState(loadStoredState);
  const [selectedExample, setSelectedExample] = useState<Example | null>(
    storedState ? null : examples.basic[0]
  );
  const [config, setConfig] = useState(storedState?.config ?? examples.basic[0].config);
  const [html, setHtml] = useState(storedState?.html ?? examples.basic[0].html);
  const [htmlFileContents, setHtmlFileContents] = useState<string | null>(null);

  const { configIsValid, result } = usePureHtml({
    inputHtml: htmlFileContents ?? html,
    configYaml: config,
    url: selectedExample?.url,
  });

  const onHtmlFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setHtmlFileContents(null);
      return;
    }

    file
      .text()
      .then((contents) => setHtmlFileContents(contents))
      .catch((err) => {
        console.error('Cannot read selected html file contents:', err);
        alert('Cannot read the HTML contents. Please try again.');
      });
  }, []);

  useEffect(() => {
    if (!selectedExample) return;
    setHtml(selectedExample.html);
    setConfig(selectedExample.config);
    setHtmlFileContents(null);
  }, [selectedExample]);

  useEffect(() => {
    try {
      const state: StoredState = { html, config };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Cannot persist playground state:', err);
    }
  }, [html, config]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-fd-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fd-foreground">
            PureHTML Playground
          </h1>
          <p className="text-sm text-fd-muted-foreground mt-1">
            Test and experiment with PureHTML configurations and HTML documents interactively in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="example-select" className="text-xs font-medium text-fd-muted-foreground whitespace-nowrap">
            Example:
          </label>
          <select
            id="example-select"
            value={selectedExample?.name ?? ''}
            onChange={(e) => {
              const ex = examples.findByName(e.target.value);
              if (ex) setSelectedExample(ex);
            }}
            className="w-full sm:w-64 px-3 py-1.5 rounded-lg border border-fd-border bg-fd-background text-fd-foreground text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-fd-primary cursor-pointer shadow-xs"
          >
            <option value="" disabled>Select an example...</option>
            <optgroup label="Basics">
              {examples.basic.map((ex) => (
                <option key={ex.name} value={ex.name}>
                  {ex.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Advanced">
              {examples.advanced.map((ex) => (
                <option key={ex.name} value={ex.name}>
                  {ex.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Input HTML & Config YAML */}
        <div className="flex flex-col gap-6">
          {/* HTML Card */}
          <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden shadow-xs">
            <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/50 px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
                <FileCode size={16} className="text-blue-500" />
                <span>Input HTML</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground cursor-pointer px-2 py-1 rounded bg-fd-background border border-fd-border hover:bg-fd-muted transition-colors">
                  <Upload size={13} />
                  <span>{htmlFileContents ? 'File Loaded' : 'Upload HTML'}</span>
                  <input
                    type="file"
                    accept="text/html,.html"
                    onChange={onHtmlFileChange}
                    className="hidden"
                  />
                </label>
                {htmlFileContents && (
                  <button
                    type="button"
                    onClick={() => setHtmlFileContents(null)}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Clear file
                  </button>
                )}
              </div>
            </div>

            {htmlFileContents ? (
              <div className="p-4 bg-fd-background text-sm text-fd-muted-foreground font-mono">
                HTML file loaded. Click &quot;Clear file&quot; above to re-open the interactive editor.
              </div>
            ) : (
              <div className="h-[280px]">
                <Editor
                  height="100%"
                  language="html"
                  theme="vs-dark"
                  value={html}
                  onChange={(val) => setHtml(val ?? '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    formatOnType: true,
                    tabSize: 2,
                    insertSpaces: true,
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            )}
          </div>

          {/* Configuration YAML Card */}
          <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden shadow-xs">
            <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/50 px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
                <Settings size={16} className="text-amber-500" />
                <span>Configuration (YAML)</span>
              </div>

              {!configIsValid && (
                <div className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                  <AlertCircle size={14} />
                  <span>Invalid YAML / Syntax Error</span>
                </div>
              )}
            </div>

            <div className="h-[300px]">
              <Editor
                height="100%"
                language="yaml"
                theme="vs-dark"
                value={config}
                onChange={(val) => setConfig(val ?? '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  formatOnType: true,
                  tabSize: 2,
                  insertSpaces: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output JSON */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden shadow-xs flex flex-col h-[650px]">
            <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/50 px-4 py-2.5 shrink-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-fd-foreground">
                <Code size={16} className="text-emerald-500" />
                <span>Extracted Result (JSON)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-fd-muted-foreground">
                <span>Live output</span>
              </div>
            </div>

            <div className="flex-1">
              <Editor
                height="100%"
                language="json"
                theme="vs-dark"
                value={result}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <div className="px-4 py-2 border-t border-fd-border bg-fd-muted/30 text-[11px] text-fd-muted-foreground">
              Results update automatically as you edit the HTML or YAML rules.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
