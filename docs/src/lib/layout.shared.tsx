import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-bold text-lg tracking-tight flex items-center gap-1.5">
          <span>{appName}</span>
          <span className="text-xs px-1.5 py-0.5 rounded font-mono font-normal bg-fd-muted text-fd-muted-foreground border border-fd-border">
            docs
          </span>
        </span>
      ),
    },
    links: [
      {
        text: 'Docs',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'Playground',
        url: '/playground',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
