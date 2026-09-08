import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function CapitalizeTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>capitalize</Code> transformer
      </Title>
      <Text>
        Uppercases the first character of the string and lowercases the
        rest.
      </Text>
      <Accordion multiple>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>hELLO WORLD</div>"
              configYaml="{ selector: div, transform: capitalize }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
