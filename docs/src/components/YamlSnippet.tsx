import { CodeHighlight } from '@mantine/code-highlight';

export function YamlSnippet({ code }: { code: string }) {
  return <CodeHighlight code={code} lang="yaml" />;
}
