import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function JSONTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>json</Code> transformer
      </Title>
      <Text>
        Parse a JSON string with <Code>JSON.parse</Code> or a similar
        implementation.
      </Text>
      <Text>Examples:</Text>
      <Accordion multiple>
        <Accordion.Item value="reduxStore">
          <Accordion.Control h={rem(35)}>
            Extract a initial JSON used for client-side rendering.
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={`<body>
  <main></main>
  <script id="reduxStore" type="mime/invalid">
    {"foo": "bar"}
  </script>
</body>`}
              configYaml="{ selector: script#reduxStore, transform: json }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
