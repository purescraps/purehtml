import { CodeHighlight, CodeHighlightTabs } from '@mantine/code-highlight';
import { Anchor, Box, Text, Title, rem } from '@mantine/core';
import {
  IconBrandNpm,
  IconBrandPnpm,
  IconBrandYarn,
} from '@tabler/icons-react';

const usage = `import { ConfigFactory, extract } from '@purescraps/purehtml';

const input = \`<div>
  <p>foo</p>
  <p>bar</p>
  <p>baz</p>
</div>\`;
const config = ConfigFactory.fromYAML('selector: p');
const result = extract(inputHtml, config, 'https://example.com');`;

export function GettingStarted() {
  return (
    <Box id="getting-started" mt="md">
      <Title order={3}>Getting Started</Title>

      <Text>
        Install the{' '}
        <Anchor
          href="https://npmjs.com/package/@purescraps/purehtml"
          target="_blank"
        >
          @purescraps/purehtml
        </Anchor>{' '}
        with the package manager of your choice:
      </Text>

      <CodeHighlightTabs
        code={[
          {
            code: 'npm i -S @purescraps/purehtml',
            language: 'bash',
            fileName: 'npm',
            icon: <IconBrandNpm width={rem(20)} />,
          },
          {
            code: 'yarn add @purescraps/purehtml',
            language: 'bash',
            fileName: 'yarn',
            icon: <IconBrandYarn width={rem(20)} />,
          },
          {
            code: 'pnpm add @purescraps/purehtml',
            language: 'bash',
            fileName: 'pnpm',
            icon: <IconBrandPnpm width={rem(20)} />,
          },
        ]}
        mt="sm"
      />

      <Text mt="xs" size="xs">
        Currently, the parsing backend is only implemented in TypeScript.
        Implementations in different languages is in our roadmap.
      </Text>

      <Text mt="sm">Usage:</Text>
      <CodeHighlight code={usage} lang="typescript" />
    </Box>
  );
}
