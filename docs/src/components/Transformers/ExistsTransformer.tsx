import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function ExistsTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>exists</Code> transformer
      </Title>
      <Text>Returns true if the given selector returned any elements.</Text>
      <Accordion multiple>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>Hello, world!</div>"
              configYaml="{ selector: div, transform: exists }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="nonexisting">
          <Accordion.Control h={rem(35)}>
            Example non-existing element
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>Hello, world!</div>"
              configYaml="{ selector: span, transform: exists }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
