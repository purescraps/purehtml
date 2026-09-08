import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function LowerTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>lower</Code> transformer
      </Title>
      <Text>Lowercases the string.</Text>
      <Accordion multiple>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>Hello WORLD</div>"
              configYaml="{ selector: div, transform: lower }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
