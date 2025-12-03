import { Accordion, Code, Text, Title, rem } from '@mantine/core';
import { PureHtmlSnippet } from '../PureHtmlSnippet';

const html = `
<div>
  <a href="http://example.com/some/products/1">product 1</a>
  <a href="http://example.com/some/products/2">product 2</a>
  <a href="http://example.com/some/products/3">product 3</a>
</div>
`;

export function RemoveLastPathSectionTransformer() {
  return (
    <>
      <Title mt="md" order={5}>
        <Code>removeLastPathSection</Code> transformer
      </Title>
      <Text>Remove the last path section from URL.</Text>
      <Accordion multiple>
        <Accordion.Item value="single">
          <Accordion.Control h={rem(35)}>
            Remove the last section
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={html}
              configYaml="{ selector: a, items: { transform: [attr(href), removeLastPathSection] } }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="multiple">
          <Accordion.Control h={rem(35)}>
            Remove last 2 sections
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={html}
              configYaml="{ selector: a, items: { transform: [attr(href), removeLastPathSection, removeLastPathSection] } }"
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="search-params">
          <Accordion.Control h={rem(35)}>
            Do not remove search params
          </Accordion.Control>
          <Accordion.Panel>
            <PureHtmlSnippet
              inputHtml={`<a href="http://example.com/foo/bar/baz?search=sample+search">example link</a>`}
              configYaml={`selector: a
transform: [attr(href), removeLastPathSection]
`}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
