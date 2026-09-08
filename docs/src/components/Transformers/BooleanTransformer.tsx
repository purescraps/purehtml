import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function BooleanTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>boolean</Code> transformer
      </Title>
      <Text>
        Explicitly casts any value to a boolean using truthy semantics.
        Unlike <Code>exists</Code> (which reports whether an element or
        attribute is present), <Code>boolean</Code> casts the value itself:{' '}
        <Code>""</Code>, <Code>0</Code>, and empty arrays/objects are false;
        everything else is true.
      </Text>
      <Accordion multiple>
        <Accordion.Item value="truthy">
          <Accordion.Control h={rem(35)}>
            A non-empty value is true
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>hello</div>"
              configYaml="{ selector: div, transform: boolean }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="falsy">
          <Accordion.Control h={rem(35)}>
            An empty value is false
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div></div>"
              configYaml="{ selector: div, transform: boolean }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
