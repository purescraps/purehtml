import { CodeHighlight } from '@mantine/code-highlight';

export function JsonSnippet({ code }: { code: string }) {
  return <CodeHighlight code={code} lang="json" />;
}
