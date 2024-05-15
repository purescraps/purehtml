import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

const html = `<div>
  <p>Hello, world!</p>
</div>`;

export function HtmlTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>html</Code> transformer
      </Title>
      <Text>
        Returns <Code>innerHTML</Code> of the matched element.
      </Text>
      <Accordion>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={html}
              configYaml="{ selector: div, transform: html }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="nonexisting">
          <Accordion.Control h={rem(35)}>
            Example non-existing element
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={html}
              configYaml="{ selector: span, transform: html }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
