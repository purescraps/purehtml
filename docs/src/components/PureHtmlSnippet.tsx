import { CodeHighlightTabs } from '@mantine/code-highlight';
import { usePureHtml } from '../hooks/usePureHtml';

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

  return (
    <CodeHighlightTabs
      code={[
        { fileName: 'input.html', code: inputHtml, language: 'html' },
        { fileName: 'config.yaml', code: configYaml, language: 'yaml' },
        { fileName: 'output.json', code: result, language: 'json' },
      ]}
      mt="md"
    />
  );
}
