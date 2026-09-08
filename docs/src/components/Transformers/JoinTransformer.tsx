import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function JoinTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>join</Code> transformer
      </Title>
      <Text>
        Joins an array into a string. <Code>join()</Code> joins with an empty
        string; <Code>join(delimiter)</Code> joins with the given delimiter.
      </Text>
      <Accordion multiple>
        <Accordion.Item value="delimiter">
          <Accordion.Control h={rem(35)}>
            Split then join with a delimiter
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>a,b,c</div>"
              configYaml={`{ selector: div, transform: ['split(",")', 'join(" - ")'] }`}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
