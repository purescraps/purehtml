import { Accordion, Anchor, Box, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from './PureHtmlSnippet';

export function ConstantConfig() {
  return (
    <Box id="constant-config" mt="md">
      <Title order={3}>Constant config</Title>

      <Text>
        This configuration accepts only <Code>constant</Code> property and
        returns its value. This transformer is really useful as the in the{' '}
        <Anchor href="#union">union</Anchor> config as <Code>default</Code>{' '}
        case, similar to switch/case statement JavaScript and other languages.
      </Text>

      <Accordion>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>Sample content</div>"
              configYaml="{ constant: constant value }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="complex">
          <Accordion.Control h={rem(35)}>Complex object</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>Sample content</div>"
              configYaml="{ constant: { complex: { values: ['are', 'possible'] } } }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
}
