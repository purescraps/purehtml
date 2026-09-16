import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function JSONPathTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>jsonpath</Code> transformer
      </Title>
      <Text>
        Navigates a parsed JSON value (typically the output of{' '}
        <Code>json</Code>) by <Code>path</Code>, e.g. to pull a single field
        out of <Code>__NEXT_DATA__</Code>, JSON-LD, or other inline state. Use{' '}
        <Code>.name</Code> for an object key, <Code>[0]</Code> for an array
        index (negative indices count from the end), and{' '}
        <Code>{'["key"]'}</Code> for a key with special characters. Returns{' '}
        <Code>null</Code> when the path does not resolve to a value.
      </Text>
      <Text>Examples:</Text>
      <Accordion multiple>
        <Accordion.Item value="jsonld">
          <Accordion.Control h={rem(35)}>
            Extract a price from an embedded JSON-LD script.
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={`<script type="application/ld+json">
  {"offers": {"price": 42.5, "currency": "USD"}}
</script>`}
              configYaml={`{ selector: 'script[type="application/ld+json"]', transform: [json, 'jsonpath("$.offers.price")'] }`}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
