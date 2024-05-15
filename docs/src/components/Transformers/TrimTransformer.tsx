import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function TrimTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>trim</Code> transformer
      </Title>
      <Text>
        Trims all the subsequent whitespaces/newlines from start and end of the
        string.
      </Text>
      <Accordion multiple>
        <Accordion.Item value="withoud trim">
          <Accordion.Control h={rem(35)}>
            Example without trim
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>     text    </div>"
              configYaml="{ selector: div }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="example">
          <Accordion.Control h={rem(35)}>Example with trim</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>     text    </div>"
              configYaml="{ selector: div, transform: trim }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
