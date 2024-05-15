import { ConfigFactory, extract } from '@purescraps/purehtml';
import { useMemo } from 'react';

export interface PureHtml {
  result: string;
}

export function usePureHtml({
  inputHtml,
  configYaml,
}: {
  inputHtml: string;
  configYaml: string;
}): string {
  const config = useMemo(
    () => ConfigFactory.fromYAML(configYaml),
    [configYaml]
  );

  return useMemo(
    () =>
      JSON.stringify(
        extract(inputHtml, config, 'https://example.com'),
        null,
        '  '
      ),
    [inputHtml, config]
  );
}
