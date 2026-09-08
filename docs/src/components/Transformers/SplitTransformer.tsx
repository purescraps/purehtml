import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function SplitTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>split</Code> transformer
      </Title>
      <Text>
        Splits a string into an array. <Code>split()</Code> splits on runs of
        whitespace; <Code>split(delimiter)</Code> splits on the literal
        delimiter (quote it if it contains a comma or space).
      </Text>
      <Accordion multiple>
        <Accordion.Item value="delimiter">
          <Accordion.Control h={rem(35)}>
            Split on a delimiter
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>a,b,c</div>"
              configYaml={`{ selector: div, transform: 'split(",")' }`}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="whitespace">
          <Accordion.Control h={rem(35)}>
            Split on whitespace
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>  foo   bar baz  </div>"
              configYaml="{ selector: div, transform: split }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
