import { Box, Code, Text, Title } from '@mantine/core';
import { PureHtmlSnippet } from './PureHtmlSnippet';

const basic = {
  html: `<div>
  <span>a</span>
  <span>b</span>
  <span>c</span>
</div>`,
  config: `selector: span
type: array
items: {}
`,
};

const transformer = {
  html: `<div>
  <a href="https://example.com/foo">a</a>
  <a href="https://example.com/bar">b</a>
  <a href="https://example.com/baz">c</a>
</div>`,
  config: `selector: a
type: array
items:
  transform: attr(href)
`,
};

export function Arrays() {
  return (
    <Box mt="md">
      <Title order={3}>Arrays</Title>

      <Text>
        Extracting an array can be done by setting{' '}
        <Code>
          {'{'} type: array, items: {'<configuration>'} {'}'}
        </Code>{' '}
        in our config.
      </Text>
      <PureHtmlSnippet inputHtml={basic.html} configYaml={basic.config} />

      <Title mt="md" order={5}>
        Appying transformers to the items:
      </Title>

      <Text>
        Let's say, we want to extract attributes of the matched items. We can
        use <Code>attr(...name: string[])</Code> transformer.
      </Text>

      <PureHtmlSnippet
        inputHtml={transformer.html}
        configYaml={transformer.config}
      />
    </Box>
  );
}
