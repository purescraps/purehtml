'use client';

import { useState } from 'react';
import { usePureHtml } from '../hooks/usePureHtml';
import { Check, Copy } from 'lucide-react';

export function PureHtmlSnippet({
  inputHtml,
  configYaml,
  url,
}: {
  inputHtml: string;
  configYaml: string;
  url?: string;
}) {
  const { result } = usePureHtml({ inputHtml, configYaml, url });
  const [activeTab, setActiveTab] = useState<'html' | 'yaml' | 'json'>('yaml');
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'yaml' as const, label: 'config.yaml', code: configYaml },
    { id: 'html' as const, label: 'input.html', code: inputHtml },
    { id: 'json' as const, label: 'output.json', code: result || 'null' },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTab.code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-fd-border bg-fd-card overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/50 px-3 py-1.5 text-xs">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-fd-background text-fd-foreground font-medium shadow-xs border border-fd-border'
                  : 'text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded-md text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
          title="Copy snippet"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-fd-background">
        <pre className="text-fd-foreground">
          <code>{currentTab.code.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
