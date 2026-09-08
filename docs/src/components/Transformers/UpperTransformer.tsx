import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function UpperTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>upper</Code> transformer
      </Title>
      <Text>Uppercases the string.</Text>
      <Accordion multiple>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>Hello world</div>"
              configYaml="{ selector: div, transform: upper }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
