import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function NumberTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>number</Code> transformer
      </Title>
      <Text>Casts the output to a number.</Text>
      <Accordion>
        <Accordion.Item value="withoud number">
          <Accordion.Control h={rem(35)}>
            Example without number
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>1234</div>"
              configYaml="{ selector: div }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example with number</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>1234</div>"
              configYaml="{ selector: div, transform: number }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
