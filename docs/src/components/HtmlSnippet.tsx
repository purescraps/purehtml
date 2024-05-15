import { CodeHighlight } from '@mantine/code-highlight';

export function HtmlSnippet({ code }: { code: string }) {
  return <CodeHighlight code={code} lang="html" />;
}
