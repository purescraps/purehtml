import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

const resolveExample = {
  html: `<div>
  <a href="/about">internal</a>
  <a href="/articles/../help">internal - relative</a>
  <a href="https://github.com/purescraps/purehtml">external</a>
</div>`,
  config: `selector: a
type: array
items:
  # we don't pass any selector here. we already got the <a> element here.
  # we will first extract the "href" attribute, then resolve the value.
  transform: ['attr(href)', resolve]
`,
};

export function ResolveTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>resolve</Code> transformer
      </Title>
      <Text>
        Resolves URLs by the given values with the URL given to
        <Code>extract()</Code> call.
      </Text>
      <Accordion>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={resolveExample.html}
              configYaml={resolveExample.config}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
