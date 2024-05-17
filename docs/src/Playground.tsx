'use client';

import {
  Accordion,
  Alert,
  Grid,
  Paper,
  Select,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { Editor, useMonaco } from '@monaco-editor/react';
import {
  IconHtml,
  IconJson,
  IconSettingsAutomation,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Example, exampleToComboboxItem, examples } from './examples';
import { usePureHtml } from './hooks/usePureHtml';

export function Playground() {
  const { colorScheme } = useMantineColorScheme();
  const monaco = useMonaco();
  const [selectedExample, setSelectedExample] = useState<Example | null>(
    examples.basic[0]
  );
  const [config, setConfig] = useState('');
  const [html, setHtml] = useState('');
  const { configIsValid, result } = usePureHtml({
    inputHtml: html,
    configYaml: config,
  });

  useEffect(() => {
    if (!selectedExample) {
      return;
    }

    setHtml(selectedExample.html);
    setConfig(selectedExample.config);
  }, [selectedExample]);

  // adjust the vscode theme to the color mantine theme
  useEffect(() => {
    monaco?.editor.setTheme(colorScheme === 'dark' ? 'vs-dark' : 'vs');
  }, [monaco, colorScheme]);

  return (
    <>
      <Grid>
        <Grid.Col span={{ sm: 12, md: 3 }}>
          <Select
            label="Select from the examples:"
            size="sm"
            data={[
              {
                group: 'Basics',
                items: examples.basic.map(exampleToComboboxItem),
              },
              {
                group: 'Advanced',
                items: examples.advanced.map(exampleToComboboxItem),
              },
            ]}
            onChange={(name) => setSelectedExample(examples.findByName(name))}
            value={selectedExample?.name}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Accordion multiple defaultValue={['html', 'config']}>
            <Accordion.Item value="html">
              <Accordion.Control h="2em" icon={<IconHtml />}>
                HTML
              </Accordion.Control>
              <Accordion.Panel>
                <Paper shadow="sm" pt="sm" withBorder>
                  <Editor
                    height="25vh"
                    language="html"
                    options={{
                      formatOnType: true,
                      tabSize: 2,
                      insertSpaces: true,
                      minimap: { enabled: false },
                    }}
                    onChange={(val) => setHtml(val ?? '')}
                    value={html}
                    theme="vs-dark"
                  />
                </Paper>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="config">
              <Accordion.Control h="2em" icon={<IconSettingsAutomation />}>
                Configuration
              </Accordion.Control>
              <Accordion.Panel>
                <Paper shadow="sm" pt="sm" withBorder>
                  <Editor
                    height="30vh"
                    language="yaml"
                    options={{
                      formatOnType: true,
                      tabSize: 2,
                      insertSpaces: true,
                      minimap: { enabled: false },
                    }}
                    onChange={(val) => setConfig(val ?? '')}
                    value={config}
                    theme="vs-dark"
                  />

                  {configIsValid === false && (
                    <Alert variant="filled" color="red">
                      Invalid config
                    </Alert>
                  )}
                </Paper>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <Title order={4} mb="sm">
            <IconJson size="1.1em" /> Result
          </Title>

          <Paper shadow="sm" pt="sm" withBorder>
            <Editor
              height="50vh"
              language="json"
              value={result}
              options={{
                formatOnType: true,
                tabSize: 2,
                insertSpaces: true,
                readOnly: true,
                minimap: { enabled: false },
                theme: 'vs-dark',
              }}
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}
