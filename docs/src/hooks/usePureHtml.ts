import { ConfigFactory, extract } from '@purescraps/purehtml';
import { useEffect, useState } from 'react';

export interface UsePureHtml {
  configIsValid: boolean;
  result: string;
}

export function usePureHtml({
  inputHtml,
  configYaml,
}: {
  inputHtml: string;
  configYaml: string;
}): UsePureHtml {
  const [state, setState] = useState<UsePureHtml>({
    configIsValid: true,
    result: '',
  });
  const [config, setConfig] = useState<unknown>(null);

  useEffect(() => {
    if (!configYaml) {
      setState((s) => ({ ...s, configIsValid: true }));
      return;
    }

    try {
      setConfig(ConfigFactory.fromYAML(configYaml));
      setState((s) => ({ ...s, configIsValid: true }));
    } catch (err) {
      setState((s) => ({ ...s, configIsValid: false }));
    }
  }, [configYaml]);

  useEffect(() => {
    if (!config || !inputHtml) {
      setState((s) => ({ ...s, result: '' }));
      return;
    }

    try {
      const result = JSON.stringify(
        extract(inputHtml, config as any, 'https://example.com'),
        null,
        '  '
      );
      setState((s) => ({ ...s, result }));
    } catch (err) {
      setState((s) => ({ ...s, result: '' }));
    }
  }, [config, inputHtml]);

  return state;
}
