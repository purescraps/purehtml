import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function LengthTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>length</Code> transformer
      </Title>
      <Text>
        Returns the length of the <Code>string</Code> and <Code>array</Code>{' '}
        values.
      </Text>
      <Accordion mt="sm">
        <Accordion.Item value="string">
          <Accordion.Control h={rem(35)}>
            Length of the string
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div>Hello, world!</div>"
              configYaml="{ selector: div, transform: length }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="array">
          <Accordion.Control h={rem(35)}>Length of the array</Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div><span>hello</span> <span>foo</span> <span>bar baz</span></div>"
              configYaml={`{ selector: span, type: array, items: {}, transform: length }`}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="array-elems">
          <Accordion.Control h={rem(35)}>
            Lengths of the array elements
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<div><span>hello</span> <span>foo</span> <span>bar baz</span></div>"
              configYaml={`{ selector: span, type: array, items: { transform: length } }`}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
