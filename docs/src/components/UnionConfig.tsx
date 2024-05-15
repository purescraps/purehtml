import { Accordion, Box, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from './PureHtmlSnippet';

const example = {
  html: `<div>
    <p>paragraph element</p>
</div>`,
  config: `union:
  - selector: a # will not match
  - selector: span # will not match
  - selector: p # will match
`,
};

const exampleWithDefaultCase = {
  html: `<div>
    <p>paragraph element</p>
</div>`,
  config: `union:
  - selector: a # will not match
  - selector: span # will not match
  - constant: default value # will match
`,
};

const exampleNoMatches = {
  html: `<div>
    <p>paragraph element</p>
</div>`,
  config: `union:
  - selector: a # will not match
  - selector: span # will not match
`,
};

export function UnionConfig() {
  return (
    <Box id="union-config" mt="md">
      <Title order={3}>Union config</Title>

      <Text>
        This configuration accepts multiple configurations and returns the first
        matched config's result. You may pass a <Code>constant config</Code> as
        the last element so it will be used as <Code>default</Code> value.
      </Text>

      <Accordion mt="sm" multiple>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={example.html}
              configYaml={example.config}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="default value">
          <Accordion.Control h={rem(35)}>
            Default value if nothing matches
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={exampleWithDefaultCase.html}
              configYaml={exampleWithDefaultCase.config}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="no matches">
          <Accordion.Control h={rem(35)}>No matches</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={exampleNoMatches.html}
              configYaml={exampleNoMatches.config}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
}
