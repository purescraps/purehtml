'use client';

import { ConfigFactory, extract } from '@purescraps/purehtml';
import { load } from 'cheerio';
import { useEffect, useMemo, useState } from 'react';

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
  // cache cheerio.load call for handling big HTMLs
  const input = useMemo<cheerio.Root | null>(
    () => (inputHtml ? load(inputHtml) : null),
    [inputHtml]
  );
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
    if (!config || !input) {
      setState((s) => ({ ...s, result: '' }));
      return;
    }

    try {
      const result = JSON.stringify(
        extract(input, config as any, 'https://example.com'),
        null,
        '  '
      );
      setState((s) => ({ ...s, result }));
    } catch (err) {
      console.error('cannot extract data:', err);

      setState((s) => ({ ...s, result: '' }));
    }
  }, [config, input]);

  return state;
}
