import { CodeHighlightTabs } from '@mantine/code-highlight';
import { usePureHtml } from '../hooks/usePureHtml';

export function PureHtmlSnippet({
  inputHtml,
  configYaml,
}: {
  inputHtml: string;
  configYaml: string;
}) {
  const { configIsValid, result } = usePureHtml({ inputHtml, configYaml });

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
