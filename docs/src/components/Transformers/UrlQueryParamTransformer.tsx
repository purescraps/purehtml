import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

export function UrlQueryParamTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>urlQueryParam</Code> transformer
      </Title>
      <Text>
        Similar to the <Code>attr</Code> transformer, but this transformer works
        on the URL query parameters.
      </Text>
      <Text>Examples:</Text>
      <Accordion multiple>
        <Accordion.Item value="single">
          <Accordion.Control h={{ md: rem(35), sm: rem(50) }}>
            Extract a single query parameter's value
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<span>https://example.com/search?q=sample+search+term&additional=to+be+ignored</span>"
              configYaml="{ selector: span, transform: 'urlQueryParam(q)' }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="all">
          <Accordion.Control h={{ md: rem(35), sm: rem(50) }}>
            Extract all query parameters
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<span>https://example.com/search?q=sample+search+term&additional=to+be+ignored</span>"
              configYaml="{ selector: span, transform: 'urlQueryParam()' }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="subset">
          <Accordion.Control h={{ md: rem(35), sm: rem(50) }}>
            Extract subset of the query parameters
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml="<span>https://example.com/search?q=sample+search+term&utm_source=hackernews&additional=to+be+ignored</span>"
              configYaml="{ selector: span, transform: 'urlQueryParam(q, utm_source)' }"
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
